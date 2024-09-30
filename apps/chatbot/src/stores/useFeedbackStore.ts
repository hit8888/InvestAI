import { FeedbackEnum } from "@meaku/core/types/feedback";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  activeResponseId: string | null;
  setActiveResponseId: (responseId: string | null) => void;
  activeFeedbackType: FeedbackEnum | null;
  setActiveFeedbackType: (feedbackType: FeedbackEnum) => void;
  activeRating: string | null;
  setActiveRating: (rating: string | null) => void;
  showRatingOptions: boolean;
  setShowRatingOptions: (showRatingOptions: boolean) => void;
  showRatingForm: boolean;
  setShowRatingForm: (showRatingForm: boolean) => void;
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
      activeFeedbackType: null,
      setActiveFeedbackType: (feedbackType) => {
        set((state) => {
          state.activeFeedbackType = feedbackType;
        });
      },
      activeRating: null,
      setActiveRating: (rating) => {
        set((state) => {
          state.activeRating = rating;
        });
      },
      showRatingOptions: false,
      setShowRatingOptions: (showRatingOptions) => {
        set((state) => {
          state.showRatingOptions = showRatingOptions;
        });
      },
      showRatingForm: false,
      setShowRatingForm: (showRatingForm) => {
        set((state) => {
          state.showRatingForm = showRatingForm;
        });
      },
      handleClearFeedback: () => {
        set((state) => {
          state.activeResponseId = null;
          state.activeFeedbackType = null;
          state.showRatingOptions = false;
          state.showRatingForm = false;
        });
      },
    })),
  ),
);
