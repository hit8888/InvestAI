import { ArtifactEnum } from "@meaku/core/types/chat";
import { ChatParams } from "@meaku/core/types/config";
import { useLocalStorageState } from "ahooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "../constants/localStorage";
import { useArtifactStore } from "../stores/useArtifactStore";

type LocalStorageArtifact = {
  activeArtifactId?: string;
  activeArtifactType?: ArtifactEnum;
};

const useLocalStorageArtifact = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const localStoragePrefixKey = `${orgName?.toLowerCase()}-${agentId}`;
  const artifactKey =
    localStoragePrefixKey + LOCAL_STORAGE_KEYS.ARTIFACT_METADATA;

  const [artifact, setArtifact] =
    useLocalStorageState<LocalStorageArtifact>(artifactKey);

  const activeArtifactId = useArtifactStore((state) => state.activeArtifactId);
  const setActiveArtifactId = useArtifactStore(
    (state) => state.setActiveArtifactId,
  );
  const setActiveArtifactType = useArtifactStore(
    (state) => state.setActiveArtifactType,
  );

  const handleUpdateArtifact = async (
    newArtifact: Partial<LocalStorageArtifact>,
  ) => {
    try {
      const updatedArtifact: LocalStorageArtifact = {
        ...artifact,
        ...newArtifact,
      };

      setArtifact(updatedArtifact);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!artifact) return;

    setActiveArtifactId(artifact.activeArtifactId || null);
    setActiveArtifactType(artifact.activeArtifactType || null);
  }, [artifact]);

  useEffect(() => {
    if (activeArtifactId) return;

    handleUpdateArtifact({
      activeArtifactId: undefined,
      activeArtifactType: undefined,
    });
  }, [activeArtifactId]);

  return { artifact, handleUpdateArtifact };
};

export default useLocalStorageArtifact;
