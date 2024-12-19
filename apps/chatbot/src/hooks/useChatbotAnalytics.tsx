import { useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { ChatParams } from '@meaku/core/types/config';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import useLocalStorageSession from './useLocalStorageSession';

const useChatbotAnalytics = () => {
  const { orgName = '', agentId = '' } = useParams<ChatParams>();
  const { sessionData } = useLocalStorageSession();
  const { trackEvent } = useAnalytics();

  const commonProperties = useMemo(
    () => ({
      orgName,
      agentId,
      session_id: sessionData?.sessionId,
      prospect_id: sessionData?.prospectId,
    }),
    [orgName, agentId, sessionData?.sessionId, sessionData?.prospectId],
  );

  const trackChatbotEvent = useCallback(
    (eventName: string, properties: Record<string, unknown> = {}) => {
      trackEvent(eventName, { ...commonProperties, ...properties });
    },
    [trackEvent, commonProperties],
  );

  return { trackChatbotEvent };
};

export default useChatbotAnalytics;
