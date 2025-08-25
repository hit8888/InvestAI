import { MessageEventType, type Message as MessageType } from '../../../../types/message';
import { extractMessageEventType, extractMessageEventData } from '../../../../utils/message-utils';

export const extractFilledFormArtifactIds = (renderableMessages: MessageType[]): string[] => {
  return renderableMessages
    .filter((message) => {
      const eventType = extractMessageEventType(message);
      const eventData = extractMessageEventData(message);
      return eventType === MessageEventType.FORM_FILLED && eventData && 'artifact_id' in eventData;
    })
    .map((message) => {
      const eventData = extractMessageEventData(message);
      return (eventData as { artifact_id: string }).artifact_id;
    });
};

export const extractFilledQualificationArtifactIds = (renderableMessages: MessageType[]): string[] => {
  return renderableMessages
    .filter((message) => {
      const eventType = extractMessageEventType(message);
      const eventData = extractMessageEventData(message);
      return eventType === MessageEventType.QUALIFICATION_FORM_FILLED && eventData && 'artifact_id' in eventData;
    })
    .map((message) => {
      const eventData = extractMessageEventData(message);
      return (eventData as { artifact_id: string }).artifact_id;
    });
};

export const extractFilledCalendarUrls = (renderableMessages: MessageType[]): string[] => {
  const calendarSubmitMessages = renderableMessages.filter((message) => {
    const eventType = extractMessageEventType(message);
    const eventData = extractMessageEventData(message);
    return eventType === MessageEventType.CALENDAR_SUBMIT && eventData && 'calendar_url' in eventData;
  });

  return calendarSubmitMessages
    .map((message) => {
      const eventData = extractMessageEventData(message);
      return (eventData as { calendar_url: string }).calendar_url;
    })
    .filter((url) => url && url !== ''); // Filter out empty strings
};

export const getFilledData = (
  renderableMessages: MessageType[],
  responseId: string,
): Record<string, string> | undefined => {
  const formfilledMessage = renderableMessages.find((message) => {
    const eventType = extractMessageEventType(message);
    return eventType === MessageEventType.FORM_FILLED && message.response_id === responseId;
  });
  if (!formfilledMessage) return undefined;
  const eventData = extractMessageEventData(formfilledMessage);
  return (eventData as { form_data: Record<string, string> })?.form_data;
};

export const getQualificationFilledData = (
  renderableMessages: MessageType[],
  responseId: string,
): Array<{ id: string; answer: string }> => {
  const qualificationFilledMessage = renderableMessages.find((message) => {
    const eventType = extractMessageEventType(message);
    return eventType === MessageEventType.QUALIFICATION_FORM_FILLED && message.response_id === responseId;
  });
  if (!qualificationFilledMessage) return [];
  const eventData = extractMessageEventData(qualificationFilledMessage);
  return (
    (eventData as { qualification_responses: Array<{ id: string; answer: string }> })?.qualification_responses || []
  );
};

export const isQualificationFilled = (
  renderableMessages: MessageType[],
  _artifactId: string,
  responseId?: string,
): boolean => {
  return getQualificationFilledData(renderableMessages, responseId || '').length > 0;
};

export const getMessagesWithinAdminSessions = (renderableMessages: MessageType[]): Set<string> => {
  const withinAdminSession = new Set<string>();
  let isInAdminSession = false;

  renderableMessages.forEach((message) => {
    const eventType = extractMessageEventType(message);

    // Start admin session when JOIN_SESSION is found
    if (eventType === 'JOIN_SESSION') {
      isInAdminSession = true;
    }

    // Add message to admin session if we're in an admin session
    if (isInAdminSession && message.response_id) {
      withinAdminSession.add(message.response_id);
    }

    // End admin session when LEAVE_SESSION is found
    if (eventType === 'LEAVE_SESSION') {
      isInAdminSession = false;
    }
  });

  return withinAdminSession;
};
