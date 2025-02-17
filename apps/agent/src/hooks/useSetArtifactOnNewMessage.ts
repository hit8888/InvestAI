import { useEffect } from 'react';
import { useArtifactStore } from '../stores/useArtifactStore';
import { useMessageStore } from '../stores/useMessageStore';
import { ArtifactMessageContent } from '@meaku/core/types/webSocketData';

const SUPPORTED_ARTIFACT_TYPES = ['SLIDE', 'SLIDE_IMAGE', 'VIDEO'] as const;
export type SupportedArtifactType = (typeof SUPPORTED_ARTIFACT_TYPES)[number];

const isArtifactTypeSupported = (type: string): type is SupportedArtifactType => {
  return SUPPORTED_ARTIFACT_TYPES.includes(type as SupportedArtifactType);
};

export const useSetArtifactOnNewMessage = () => {
  const messages = useMessageStore((state) => state.messages);
  const latestResponseId = useMessageStore((state) => state.latestResponseId);
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);

  // Find the last supported artifact message in the current response sequence
  const lastArtifactMessage = messages
    .filter(
      (message) =>
        message.response_id === latestResponseId &&
        message.message_type === 'ARTIFACT' &&
        message.role === 'ai' &&
        isArtifactTypeSupported((message.message as ArtifactMessageContent).artifact_type),
    )
    .pop();

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
