import { ArtifactBaseType } from '@meaku/core/types/webSocketData';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  isArtifactPlaying: boolean;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  activeArtifact: ArtifactBaseType | null;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
}

//This will store  SlideImageArtifactContent | SlideArtifactContent | VideoArtifactContent only
const useArtifactStore = create<State>()(
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
    })),
  ),
);

export default useArtifactStore;
