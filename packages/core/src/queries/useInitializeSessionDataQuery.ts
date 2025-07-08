import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { initializeSession } from '../http/api';
import { BreakoutQueryOptions } from '../types/queries';
import { defaultQueryClient } from './defaultQueryClient';
import { SessionApiResponse } from '../types/api/session_init_response';
import { InitializationPayload } from '../types/api/session_init_request';
import { AgentParams } from '../types/config';
import { useRef } from 'react';
import { useUrlParams } from '../hooks/useUrlParams';

const getProspectIdFromSession = (sessionDataKey: string) => {
  const sessionData = JSON.parse(localStorage.getItem(sessionDataKey) ?? '{}');
  return sessionData?.prospectId || '';
};

const initializeSessionKey = (): unknown[] => ['session-initializer'];

type InitialiseSessionKey = ReturnType<typeof initializeSessionKey>;

interface UseInitializeSessionDataOptions {
  agentId: string;
  queryOptions: BreakoutQueryOptions<SessionApiResponse, InitialiseSessionKey>;
  initializeSessionPayload: InitializationPayload;
}

export const useInvalidateSessionData = () => {
  return {
    invalidateSession: async () => {
      await defaultQueryClient.invalidateQueries({
        queryKey: initializeSessionKey(),
      });
    },
  };
};

const MAX_RETRY_COUNT = 3;

const useInitializeSessionDataQuery = ({
  agentId,
  initializeSessionPayload,
  queryOptions,
}: UseInitializeSessionDataOptions): UseQueryResult<SessionApiResponse> => {
  const { orgName = '' } = useParams<AgentParams>();
  const { removeParam } = useUrlParams();
  const sessionDataKey = `${orgName?.toLowerCase()}-${agentId}`;
  const retryCount = useRef(0);

  return useQuery({
    queryKey: initializeSessionKey(),
    queryFn: async () => {
      let prospectId = getProspectIdFromSession(sessionDataKey) || initializeSessionPayload.prospect_id;
      let sessionId = initializeSessionPayload.session_id;

      // Before the last retry, we reset the prospectId and sessionId
      if (retryCount.current === MAX_RETRY_COUNT - 1) {
        prospectId = null;
        sessionId = null;
      }

      const response = await initializeSession(agentId, {
        ...initializeSessionPayload,
        session_id: sessionId,
        prospect_id: prospectId,
      });
      const session = response.data as SessionApiResponse;

      removeParam('browsed_urls');
      return session;
    },
    retry: (failureCount) => {
      retryCount.current = failureCount;
      return failureCount < MAX_RETRY_COUNT;
    },
    ...queryOptions,
  });
};

export default useInitializeSessionDataQuery;
