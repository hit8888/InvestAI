import { isGeneratingMediaArtifactEvent } from '@meaku/core/utils/messageUtils';
import useGetLastMediaArtifactMessage from './useGetLastMediaArtifactMessage';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

export const useGetArtifactLoadingState = () => {
  const { currentResponseIdMessages, lastArtifactMessage } = useGetLastMediaArtifactMessage();

  const hasGeneratingArtifactEvents = Boolean(
    currentResponseIdMessages.find((message: WebSocketMessage) => isGeneratingMediaArtifactEvent(message)) &&
      !lastArtifactMessage,
  );

  return {
    hasGeneratingArtifactEvents,
  };
};
