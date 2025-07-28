import { WebSocketMessage } from '@meaku/core/types/webSocketData';

export const shouldShowSuggestions = (
  aiMessages: WebSocketMessage[],
  hasFirstUserMessageBeenSent?: boolean,
): boolean => {
  return aiMessages.length <= 1 && !hasFirstUserMessageBeenSent;
};

export const calculateMinHeight = (
  isLastGroupWithContent: boolean,
  aiMessages: WebSocketMessage[],
  hasFirstUserMessageBeenSent: boolean | undefined,
  containerHeight: number,
): string | undefined => {
  if (!isLastGroupWithContent) return undefined;

  if (aiMessages.length > 1 || hasFirstUserMessageBeenSent) {
    return `${containerHeight}px`;
  }

  return undefined;
};
