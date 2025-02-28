import { useParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { AgentParams } from '@meaku/core/types/config';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import useLocalStorageSession from './useLocalStorageSession';
import { useUrlParams } from './useUrlParams';

const useAgentbotAnalytics = () => {
  const { orgName = '', agentId = '' } = useParams<AgentParams>();
  const { sessionData } = useLocalStorageSession();
  const { trackEvent } = useAnalytics();
  const { getParam } = useUrlParams();
  const is_test = getParam('is_test') === 'true';

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
      trackEvent(eventName, { ...commonProperties, ...properties }, is_test);
    },
    [trackEvent, commonProperties],
  );

  return { trackAgentbotEvent };
};

export default useAgentbotAnalytics;
