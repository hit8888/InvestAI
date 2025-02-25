import { useEffect } from 'react';
import { useArtifactStore } from '../stores/useArtifactStore';
import { ArtifactMessageContent } from '@meaku/core/types/webSocketData';
import useGetLastMediaArtifactMessage from './useGetLastMediaArtifactMessage';

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
