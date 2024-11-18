import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  isArtifactPlaying: boolean;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  shouldEndArtifactImmediately: boolean;
  setShouldEndArtifactImmediately: (shouldEnd: boolean) => void;
}
//TODO: Remove useArtifactStore;
export const useArtifactStore = create<State>()(
  devtools(
    immer((set) => ({
      isArtifactPlaying: false,
      setIsArtifactPlaying: (isPlaying) => {
        set((state) => {
          state.isArtifactPlaying = isPlaying;
        });
      },
      shouldEndArtifactImmediately: false,
      setShouldEndArtifactImmediately: (shouldEnd) => {
        set((state) => {
          state.shouldEndArtifactImmediately = shouldEnd;
        });
      },
    })),
  ),
);
