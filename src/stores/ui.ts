import { create } from "zustand";

const DISPLAY_ERROR_MS = 3000;
const GENERIC_ERROR_MESSAGE = "Something went wrong";

type ErrorItem = {
  message: string;
  id: number;
};

type State = {
  errors: ErrorItem[];
};

type Actions = {
  showErrorMessage: (message?: string, duration?: number) => void;
  hideErrorMessage: (messageId: number) => void;
};

export const useUiStore = create<State & Actions>((set) => ({
  errors: [],
  showErrorMessage: (
    message = GENERIC_ERROR_MESSAGE,
    duration = DISPLAY_ERROR_MS,
  ) => {
    const messageId = window.setTimeout(() => {
      set((state) => ({
        errors: state.errors.filter((error) => error.id !== messageId),
      }));
    }, duration);

    set((state) => ({
      errors: [...state.errors, { id: messageId, message }],
    }));
  },
  hideErrorMessage: (messageId: number) => {
    set((state) => ({
      errors: state.errors.filter((error) => error.id !== messageId),
    }));
  },
}));
