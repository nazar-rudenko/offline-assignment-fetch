import { describe, expect, beforeEach, vi, it, Mock, afterAll } from "vitest";
import { auth, logout } from "../services/dogApi/dogApi";
import { useAuthStore } from "./auth";
import { useUiStore } from "./ui.ts";

vi.mock("../services/dogApi/dogApi", () => ({
  auth: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("./ui.ts", () => {
  const showErrorMessage = vi.fn();
  return {
    useUiStore: {
      getState: () => ({
        showErrorMessage,
      }),
    },
  };
});

describe("useAuthStore", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    useAuthStore.setState({ user: null, expiresAt: 0 });
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should login and set user correctly", async () => {
    const mockUser = { name: "John Doe", email: "john@example.com" };

    (auth as Mock).mockResolvedValueOnce(undefined);

    await useAuthStore.getState().login(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.expiresAt).toBeGreaterThan(Date.now());
    expect(auth).toHaveBeenCalledWith(mockUser);
  });

  it("should handle login failure and show error message", async () => {
    (auth as Mock).mockRejectedValueOnce(new Error("Login failed"));

    await useAuthStore
      .getState()
      .login({ name: "Jane Doe", email: "jane@example.com" });

    expect(useUiStore.getState().showErrorMessage).toHaveBeenCalledWith(
      "Login failed",
    );
  });

  it("should logout and clear user data", () => {
    useAuthStore.setState({
      user: { name: "John", email: "john@example.com" },
      expiresAt: Date.now() + 10000,
    });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.expiresAt).toBe(0);
    expect(logout).toHaveBeenCalled();
    expect(localStorage.getItem("auth")).toBeNull();
  });

  it("should correctly determine authentication status", () => {
    useAuthStore.setState({ expiresAt: Date.now() + 10000 });
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);

    useAuthStore.setState({ expiresAt: Date.now() - 10000 });
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });
});
