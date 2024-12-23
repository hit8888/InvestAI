import { GetArtifactPayload } from '@meaku/core/types/api';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  isArtifactPlaying: boolean;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  shouldEndArtifactImmediately: boolean;
  setShouldEndArtifactImmediately: (shouldEnd: boolean) => void;
  activeArtifact: GetArtifactPayload | null;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
}

export const useArtifactStore = create<State>()(
  devtools(
    immer((set) => ({
      activeArtifact: null,
      setActiveArtifact: (artifact) => {
        set((state) => {
          state.activeArtifact = artifact;
        });
      },
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
