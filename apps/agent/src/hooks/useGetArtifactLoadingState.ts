import { isGeneratingArtifactEvent } from '@meaku/core/utils/messageUtils';
import useGetLastMediaArtifactMessage from './useGetlastMediaArtifactMessage';

export const useGetArtifactLoadingState = () => {
  const { currentResponseIdMessages, lastArtifactMessage } = useGetLastMediaArtifactMessage();

  const hasGeneratingArtifactEvents = Boolean(
    currentResponseIdMessages.find((message) => isGeneratingArtifactEvent(message)) && !lastArtifactMessage,
  );

  return {
    hasGeneratingArtifactEvents,
  };
};
