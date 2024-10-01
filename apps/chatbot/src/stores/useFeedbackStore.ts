import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  activeResponseId: string | null;
  setActiveResponseId: (responseId: string | null) => void;
  handleClearFeedback: () => void;
}

export const useFeedbackStore = create<State>()(
  devtools(
    immer((set) => ({
      activeResponseId: null,
      setActiveResponseId: (responseId) => {
        set((state) => {
          state.activeResponseId = responseId;
        });
      },
      handleClearFeedback: () => {
        set((state) => {
          state.activeResponseId = null;
        });
      },
    })),
  ),
);
