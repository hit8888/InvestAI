import last from 'lodash/last';
import { useArtifactStore } from '../stores/useArtifactStore';
import { useMessageStore } from '../stores/useMessageStore';
import { useEffect } from 'react';

const useUpdateActiveArtifactOnNewMessage = () => {
  const messages = useMessageStore((state) => state.messages);
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  const lastMessage = last(messages.filter((message) => message.role === 'ai'));
  const artifactId = lastMessage?.artifact?.artifact_id;
  const artifactType = lastMessage?.artifact?.artifact_type;

  useEffect(() => {
    if (!artifactId) {
      return;
    }
    const artifactTypesNotToCache = ['NONE', 'SUGGESTIONS'];
    if (artifactId && artifactType && !artifactTypesNotToCache.includes(artifactType)) {
      setActiveArtifact({
        artifactId,
        artifactType,
      });
      return;
    }
  }, [artifactId, artifactType, setActiveArtifact]);
};

export { useUpdateActiveArtifactOnNewMessage };
