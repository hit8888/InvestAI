import { useEffect } from 'react';
import useWebSocketChat from './useWebSocketChat';
import { AIResponse } from '@meaku/core/types/chat';
import { useArtifactStore } from '../stores/useArtifactStore';

const useUpdateActiveArtifactOnNewMessage = () => {
  const { lastMessage } = useWebSocketChat();
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  useEffect(() => {
    if (!lastMessage) return;

    const artifactTypesNotToCache = ['NONE', 'SUGGESTIONS', 'FORM'];

    const response = JSON.parse(lastMessage.data) as AIResponse;

    const selectedArtifact = response?.artifacts?.find(
      (artifact) => !artifactTypesNotToCache.includes(artifact?.artifact_type),
    );
    const artifactType = selectedArtifact?.artifact_type;
    const artifactId = selectedArtifact?.artifact_id;

    if (artifactId && artifactType) {
      setActiveArtifact({
        artifactId,
        artifactType,
      });
      return;
    }
    setActiveArtifact(null);
  }, [lastMessage, setActiveArtifact]);
};

export { useUpdateActiveArtifactOnNewMessage };
