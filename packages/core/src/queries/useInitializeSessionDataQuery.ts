import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { initializeSession } from '../http/api';
import { BreakoutQueryOptions } from '../types/queries';
import { defaultQueryClient } from './defaultQueryClient';
import { SessionApiResponse } from '../types/api/session_init_response';
import { InitializationPayload } from '../types/api/session_init_request';
import { AgentParams } from '../types/config';

const getProspectIdFromSession = (sessionDataKey: string) => {
  const sessionData = JSON.parse(localStorage.getItem(sessionDataKey) ?? '{}');
  return sessionData?.prospectId || '';
};

const initializeSessionKey = (sessionDataKey: string): unknown[] => {
  const prospectId = getProspectIdFromSession(sessionDataKey);

  return ['session-initializer', prospectId];
};

type InitialiseSessionKey = ReturnType<typeof initializeSessionKey>;

interface UseInitializeSessionDataOptions {
  agentId: string;
  queryOptions: BreakoutQueryOptions<SessionApiResponse, InitialiseSessionKey>;
  initializeSessionPayload: InitializationPayload;
}

export const useInvalidateSessionData = () => {
  const { orgName = '', agentId = '' } = useParams<AgentParams>();
  const sessionDataKey = `${orgName?.toLowerCase()}-${agentId}`;

  return {
    invalidateSession: async () => {
      await defaultQueryClient.invalidateQueries({
        queryKey: initializeSessionKey(sessionDataKey),
      });
    },
  };
};

const useInitializeSessionDataQuery = ({
  agentId,
  initializeSessionPayload,
  queryOptions,
}: UseInitializeSessionDataOptions): UseQueryResult<SessionApiResponse> => {
  const { orgName = '' } = useParams<AgentParams>();
  const sessionDataKey = `${orgName?.toLowerCase()}-${agentId}`;
  const prospectIdFromSession = getProspectIdFromSession(sessionDataKey);

  return useQuery({
    queryFn: async () => {
      const response = await initializeSession(agentId, {
        ...initializeSessionPayload,
        prospect_id: prospectIdFromSession ? prospectIdFromSession : initializeSessionPayload.prospect_id,
      });
      const session = response.data as SessionApiResponse;
      return session;
    },
    ...queryOptions,
    queryKey: initializeSessionKey(sessionDataKey),
  });
};

export default useInitializeSessionDataQuery;
