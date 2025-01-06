import { GetArtifactPayload } from '@meaku/core/types/api';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  isArtifactPlaying: boolean;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  activeArtifact: GetArtifactPayload | null;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
  previousArtifact: GetArtifactPayload | null;
  setPreviousActiveArtifact: (artifact: GetArtifactPayload | null) => void;
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
      previousArtifact: null,
      setPreviousActiveArtifact: (artifact) => {
        set((state) => {
          state.previousArtifact = artifact;
        });
      },
      isArtifactPlaying: false,
      setIsArtifactPlaying: (isPlaying) => {
        set((state) => {
          state.isArtifactPlaying = isPlaying;
        });
      },
    })),
  ),
);
