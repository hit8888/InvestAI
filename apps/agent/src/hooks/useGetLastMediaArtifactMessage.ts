import { ArtifactMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { checkIsQualificationFormArtifact, isMediaArtifact } from '@meaku/core/utils/messageUtils';
import { useMessageStore } from '../stores/useMessageStore';

const useGetLastMediaArtifactMessage = () => {
  const messages = useMessageStore((state) => state.messages);
  const latestResponseId = useMessageStore((state) => state.latestResponseId);

  const currentResponseIdMessages = messages.filter(
    (message: WebSocketMessage) => message.response_id === latestResponseId,
  );

  // Find the last supported artifact message in the whole message history
  const lastArtifactMessage = messages
    .filter(
      (message: WebSocketMessage) =>
        message.message_type === 'ARTIFACT' &&
        message.role === 'ai' &&
        (isMediaArtifact((message.message as ArtifactMessageContent).artifact_type) ||
          checkIsQualificationFormArtifact(message)),
    )
    .pop();

  return {
    currentResponseIdMessages,
    lastArtifactMessage,
  };
};

export default useGetLastMediaArtifactMessage;
