import { useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { AgentParams } from '@meaku/core/types/config';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import useLocalStorageSession from './useLocalStorageSession';

const useAgentbotAnalytics = () => {
  const { orgName = '', agentId = '' } = useParams<AgentParams>();
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

  const trackAgentbotEvent = useCallback(
    (eventName: string, properties: Record<string, unknown> = {}) => {
      trackEvent(eventName, { ...commonProperties, ...properties });
    },
    [trackEvent, commonProperties],
  );

  return { trackAgentbotEvent };
};

export default useAgentbotAnalytics;
