import { ArtifactEnum } from "@meaku/core/types/chat";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  activeArtifactId: string | null;
  setActiveArtifactId: (artifactId: string | null) => void;
  activeArtifactType: ArtifactEnum | null;
  setActiveArtifactType: (artifactType: ArtifactEnum | null) => void;
  handleRemoveActiveArtifact: () => void;
  handleAddActiveArtifact: (
    artifactId: string,
    artifactType: ArtifactEnum,
  ) => void;
}

export const useArtifactStore = create<State>()(
  devtools(
    immer((set) => ({
      activeArtifactId: null,
      setActiveArtifactId: (artifactId) => {
        set((state) => {
          state.activeArtifactId = artifactId;
        });
      },
      activeArtifactType: null,
      setActiveArtifactType: (artifactType) => {
        set((state) => {
          state.activeArtifactType = artifactType;
        });
      },
      handleRemoveActiveArtifact: () => {
        set((state) => {
          state.activeArtifactId = null;
          state.activeArtifactType = null;
        });
      },
      handleAddActiveArtifact: (artifactId, artifactType) => {
        set((state) => {
          state.activeArtifactId = artifactId;
          state.activeArtifactType = artifactType;
        });
      },
    })),
  ),
);
