import { describe, it, expect, beforeEach, vi, Mock, afterAll } from "vitest";
import { fetchBreeds, searchDogs, matchDogs } from "../services/dogApi/dogApi";
import { useDogStore } from "./dog";
import { useUiStore } from "./ui";
import { Dog } from "../services/dogApi/dtos";

vi.mock("../services/dogApi/dogApi", () => ({
  fetchBreeds: vi.fn(),
  searchDogs: vi.fn(),
  matchDogs: vi.fn(),
}));

vi.mock("./ui", () => {
  const showErrorMessage = vi.fn();
  return {
    useUiStore: {
      getState: vi.fn(() => ({
        showErrorMessage,
      })),
    },
  };
});

describe("useDogStore", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    useDogStore.setState({
      dogs: [],
      likedDogs: [],
      breeds: [],
      sort: { field: "breed", order: "asc" },
      filter: { ageMin: 0, ageMax: 20 },
      page: 1,
      totalPages: 0,
    });
    vi.clearAllMocks();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("fetches breeds and updates state", async () => {
    const mockBreeds = ["Labrador", "Beagle"];
    (fetchBreeds as Mock).mockResolvedValueOnce(mockBreeds);

    await useDogStore.getState().fetchBreeds();

    expect(useDogStore.getState().breeds).toEqual(mockBreeds);
  });

  it("handles breed fetch failure", async () => {
    (fetchBreeds as Mock).mockRejectedValueOnce(
      new Error("Failed to fetch breeds"),
    );

    await useDogStore.getState().fetchBreeds();

    expect(useUiStore.getState().showErrorMessage).toHaveBeenCalledWith(
      "Failed to fetch breeds",
    );
  });

  it("searches for dogs and updates state", async () => {
    const mockDogs = [{ id: "1", name: "Buddy" }];
    (searchDogs as Mock).mockResolvedValueOnce({ dogs: mockDogs, total: 1 });

    await useDogStore.getState().searchDogs();

    expect(useDogStore.getState().dogs).toEqual(mockDogs);
    expect(useDogStore.getState().totalPages).toEqual(1);
  });

  it("likes and unlikes a dog", () => {
    const dog: Dog = {
      id: "2",
      name: "Nebuchadnezzar II",
      age: 5,
      img: "image",
      breed: "Papillon",
      zip_code: "23525-23",
    };

    useDogStore.getState().likeDog(dog);
    expect(useDogStore.getState().likedDogs).toContain(dog);

    useDogStore.getState().unlikeDog(dog);
    expect(useDogStore.getState().likedDogs).not.toContain(dog);
  });

  it("matches liked dogs", async () => {
    const dog: Dog = {
      id: "1",
      name: "Otto Eduard Leopold von Bismarck",
      age: 3,
      img: "image",
      breed: "Chihuahua",
      zip_code: "12345",
    };
    useDogStore.setState({ likedDogs: [dog] });

    (matchDogs as Mock).mockResolvedValueOnce({ match: "1" });

    const matchedDog = await useDogStore.getState().matchDogs();

    expect(matchedDog).toEqual(dog);
    expect(useDogStore.getState().likedDogs).toEqual([]);
  });
});
