import { isGeneratingMediaArtifactEvent } from '@neuraltrade/core/utils/messageUtils';
import useGetLastMediaArtifactMessage from './useGetLastMediaArtifactMessage';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';

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
