import { useEffect } from 'react';
import useWebSocketChat from './useWebSocketChat';
import { AIResponse } from '@meaku/core/types/chat';
import { useArtifactStore } from '../stores/useArtifactStore';

const useUpdateActiveArtifactOnNewMessage = () => {
  const { lastMessage } = useWebSocketChat();
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  const artifactTypesNotToCache = ['NONE', 'SUGGESTIONS', 'FORM'];

  const response = lastMessage ? (JSON.parse(lastMessage.data) as AIResponse) : null;

  const selectedArtifact = response
    ? response?.artifacts?.find((artifact) => !artifactTypesNotToCache.includes(artifact?.artifact_type))
    : null;
  const artifactType = selectedArtifact?.artifact_type;
  const artifactId = selectedArtifact?.artifact_id;

  useEffect(() => {
    if (artifactId && artifactType) {
      setActiveArtifact({
        artifactId,
        artifactType,
      });
      return;
    }
    setActiveArtifact(null);
  }, [artifactId]);
};

export { useUpdateActiveArtifactOnNewMessage };
