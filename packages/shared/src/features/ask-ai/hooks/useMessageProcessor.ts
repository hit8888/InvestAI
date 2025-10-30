import { useMemo } from 'react';
import type { Message as MessageType } from '../../../types/message';
import { extractMessageEventType, extractMessageEventData } from '../../../utils/message-utils';

/**
 * Custom hook for processing message data with memoization
 * Extracts event type and event data from messages, handling both flat and nested WebSocket structures
 *
 * @param message - The message object to process
 * @returns Object containing processed message data
 */
export const useMessageProcessor = (message: MessageType) => {
  return useMemo(() => {
    const eventType = extractMessageEventType(message);
    const eventData = extractMessageEventData(message);

    return {
      eventType,
      eventData,
      // Additional computed properties for common checks
      isTextArtifact: [
        'TEXT_REQUEST',
        'TEXT_RESPONSE',
        'STREAM_RESPONSE',
        'BOOK_MEETING',
        'SUGGESTED_QUESTION_CLICKED',
        'NUDGE_CTA_CLICKED',
      ].includes(eventType),
      isAdminResponse:
        eventType === 'ADMIN_RESPONSE' ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((message as any).message_type === 'EVENT' && (message as any).message?.event_type === 'ADMIN_RESPONSE'),
      isVideoArtifact: eventType === 'VIDEO_ARTIFACT',
      isImageArtifact: eventType === 'SLIDE_IMAGE_ARTIFACT',
      isCtaEvent: eventType === 'CTA_EVENT',
      isDemoArtifact: eventType === 'DEMO_ARTIFACT',
      isPDFArtifact: eventType === 'PDF_ARTIFACT',
    };
  }, [message]);
};
