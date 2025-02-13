import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  fetchBreeds,
  searchDogs,
  matchDogs,
} from "../services/dogApi/dogApi.ts";
import { Dog } from "../services/dogApi/dtos.ts";
import { PERSISTED_STORAGE_KEYS } from "./constants.ts";
import { useUiStore } from "./ui.ts";

export const PAGE_SIZE = 12;

export type Filter = {
  zipCodes?: string[];
  breeds?: string[];
  ageMin: number;
  ageMax: number;
};

export type Sort = {
  field: "breed" | "name" | "age";
  order: "asc" | "desc";
};

export type State = {
  dogs: Dog[];
  likedDogs: Dog[];
  breeds: string[];
  sort: Sort;
  filter: Filter;
  page: number;
  totalPages: number;
};

export type Actions = {
  fetchBreeds: () => Promise<void>;
  searchDogs: () => Promise<void>;
  updateFilter: (filter: Partial<Filter>) => void;
  updateSort: (sort: Sort) => void;
  updatePage: (page: number) => void;
  likeDog: (dog: Dog) => void;
  unlikeDog: (dog: Dog) => void;
  matchDogs: () => Promise<Dog | undefined>;
};

export const useDogStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      isLoading: false,
      dogs: [],
      likedDogs: [],
      breeds: [],
      sort: {
        field: "breed",
        order: "asc",
      },
      filter: {
        ageMin: 0,
        ageMax: 20,
      },
      page: 1,
      totalPages: 0,
      fetchBreeds: async () => {
        try {
          const breeds = await fetchBreeds();
          set({ breeds });
        } catch (error) {
          if (!error || !(error instanceof Error)) return;

          console.error(error);

          const { showErrorMessage } = useUiStore.getState();
          showErrorMessage(error?.message);
        }
      },
      searchDogs: async () => {
        const { sort, filter, page } = get();
        try {
          set({ dogs: [] });
          const { dogs, total } = await searchDogs({
            size: PAGE_SIZE,
            from: (page - 1) * PAGE_SIZE,
            sort,
            ...filter,
          });
          set({ dogs, totalPages: Math.ceil(total / PAGE_SIZE) });
        } catch (error) {
          set({ totalPages: 0 });

          if (!error || !(error instanceof Error)) return;

          console.error(error);

          const { showErrorMessage } = useUiStore.getState();
          showErrorMessage(error?.message);
        }
      },
      updateFilter: (filterUpdates) => {
        const currentFilter = get().filter;
        set({
          filter: { ...currentFilter, ...filterUpdates },
          page: 1,
          totalPages: 0,
        });
      },
      updateSort: (newCriteria) => {
        set({ sort: newCriteria, page: 1, totalPages: 0 });
      },
      updatePage: (page) => {
        set({ page });
      },
      likeDog: (dog) => {
        set((state) => ({
          likedDogs: [...state.likedDogs, dog],
        }));
      },
      unlikeDog: (dog) => {
        set((state) => ({
          likedDogs: state.likedDogs.filter(
            (likedDog) => likedDog.id !== dog.id,
          ),
        }));
      },
      matchDogs: async () => {
        const likedDogs = get().likedDogs;
        const dogIdsToMatch = likedDogs.map((dog) => dog.id);
        if (dogIdsToMatch.length === 0) return undefined;
        try {
          const matchResult = await matchDogs(dogIdsToMatch as [string]);
          const matchedDog = likedDogs.find(
            (dog) => dog.id === matchResult.match,
          );
          if (matchedDog) {
            set({ likedDogs: [] });
          }
          return matchedDog;
        } catch (error) {
          if (!error || !(error instanceof Error)) return;

          console.error(error);

          const { showErrorMessage } = useUiStore.getState();
          showErrorMessage(error?.message);
        }
      },
    }),
    {
      name: PERSISTED_STORAGE_KEYS.DOGS,
      partialize: (state) => ({ likedDogs: state.likedDogs }),
    },
  ),
);
