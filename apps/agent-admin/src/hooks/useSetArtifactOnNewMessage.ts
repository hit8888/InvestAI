import { useEffect } from 'react';
import { ArtifactMessageContent } from '@neuraltrade/core/types/webSocketData';
import useGetLastMediaArtifactMessage from './useGetLastMediaArtifactMessage';
import useArtifactStore from '@neuraltrade/core/stores/useArtifactStore';

export const useSetArtifactOnNewMessage = () => {
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  const { lastArtifactMessage } = useGetLastMediaArtifactMessage();

  useEffect(() => {
    if (lastArtifactMessage) {
      const artifactData = (lastArtifactMessage.message as ArtifactMessageContent).artifact_data;
      setActiveArtifact({
        artifact_id: artifactData.artifact_id,
        artifact_type: artifactData.artifact_type,
      });
    }
  }, [lastArtifactMessage, setActiveArtifact]);
};
