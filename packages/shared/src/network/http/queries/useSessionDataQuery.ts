import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { initializeSession } from '../api';
import type { BreakoutQueryOptions } from '@meaku/core/types/queries';
import type { InitializationPayload } from '@meaku/core/types/api/session_init_request';
import type { InitSessionResponse } from '../../../types/responses';

const sessionDataKey = (): unknown[] => ['session-data'];

type SessionDataKey = ReturnType<typeof sessionDataKey>;

type SessionDataQueryPayload = InitializationPayload & {
  agentId: string;
};

const useSessionDataQuery = (
  payload: SessionDataQueryPayload,
  options: BreakoutQueryOptions<InitSessionResponse, SessionDataKey> = {},
): UseQueryResult<InitSessionResponse> => {
  const { agentId, ...requestPayload } = payload;

  const query = useQuery({
    queryFn: async () => {
      const response = await initializeSession(agentId, requestPayload);
      return response.data;
    },
    ...options,
    queryKey: sessionDataKey(),
  });

  return query;
};

export default useSessionDataQuery;
