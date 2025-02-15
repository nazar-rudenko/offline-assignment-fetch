import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, logout } from "../services/dogApi/dogApi";
import { PERSISTED_STORAGE_KEYS } from "./constants.ts";
import { useUiStore } from "./ui.ts";

export type User = {
  name: string;
  email: string;
};

export type State = {
  user: User | null;
  expiresAt: number;
};

export type Actions = {
  login: (user: User) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const TOKEN_TTL_MS = 60 * 60 * 1000;
// in case of slow connection
const TOKEN_TTL_DELTA_MS = 2 * 60 * 1000;

export const useAuthStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      user: null,
      expiresAt: 0,
      login: async (user: User) => {
        try {
          await auth(user);
          set({
            user,
            expiresAt: Date.now() + TOKEN_TTL_MS - TOKEN_TTL_DELTA_MS,
          });
        } catch (error) {
          if (!error || !(error instanceof Error)) return;

          console.error(error);

          const { showErrorMessage } = useUiStore.getState();
          showErrorMessage(error?.message);
        }
      },
      logout: () => {
        set({ user: null, expiresAt: 0 });
        void logout();
        localStorage.removeItem(PERSISTED_STORAGE_KEYS.AUTH);
        localStorage.removeItem(PERSISTED_STORAGE_KEYS.DOGS);
      },
      isAuthenticated: () => {
        return get().expiresAt > Date.now();
      },
    }),
    { name: PERSISTED_STORAGE_KEYS.AUTH },
  ),
);
