import { useMemo } from 'react';
import { type Message as MessageType } from '../../../../types/message';
import {
  extractFilledFormArtifactIds,
  extractFilledQualificationArtifactIds,
  extractFilledCalendarUrls,
  getFilledData,
  getQualificationFilledData,
  getMessagesWithinAdminSessions,
} from '../utils/messageDataUtils';

export const useMessageData = (renderableMessages: MessageType[]) => {
  // Extract filled form artifact IDs from FORM_FILLED events
  const filledFormArtifactIds = useMemo(() => {
    return extractFilledFormArtifactIds(renderableMessages);
  }, [renderableMessages]);

  // Extract filled qualification artifact IDs from QUALIFICATION_FORM_FILLED events
  const filledQualificationArtifactIds = useMemo(() => {
    return extractFilledQualificationArtifactIds(renderableMessages);
  }, [renderableMessages]);

  // Extract filled calendar URLs from CALENDAR_SUBMIT events
  const filledCalendarUrls = useMemo(() => {
    return extractFilledCalendarUrls(renderableMessages);
  }, [renderableMessages]);

  // Calculate which messages are within admin sessions
  const messagesWithinAdminSessions = useMemo(() => {
    return getMessagesWithinAdminSessions(renderableMessages);
  }, [renderableMessages]);

  const getFilledDataHandler = (responseId: string) => {
    return getFilledData(renderableMessages, responseId);
  };

  const getQualificationFilledDataHandler = (responseId: string) => {
    return getQualificationFilledData(renderableMessages, responseId);
  };

  return {
    filledFormArtifactIds,
    filledQualificationArtifactIds,
    filledCalendarUrls,
    messagesWithinAdminSessions,
    getFilledData: getFilledDataHandler,
    getQualificationFilledData: getQualificationFilledDataHandler,
  };
};
