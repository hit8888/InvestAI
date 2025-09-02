import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { initializeSession } from '../api';
import type { BreakoutQueryOptions } from '@meaku/core/types/queries';
import type { InitializationPayload } from '@meaku/core/types/api/session_init_request';
import type { InitSessionResponse } from '../../../types/responses';
import { useCommandBarStore } from '../../../stores';

const sessionDataKey = (): unknown[] => ['session-data'];

type SessionDataKey = ReturnType<typeof sessionDataKey>;

type SessionDataQueryPayload = Partial<InitializationPayload> & {
  agentId?: string;
};

const useSessionDataQuery = (
  payload: SessionDataQueryPayload,
  options: BreakoutQueryOptions<InitSessionResponse, SessionDataKey> = {},
): UseQueryResult<InitSessionResponse> => {
  const { settings, config } = useCommandBarStore();

  const query = useQuery({
    queryFn: async () => {
      const response = await initializeSession(settings.agent_id, {
        session_id: config.session_id,
        prospect_id: config.prospect_id,
        is_test: settings.is_test,
        is_admin: settings.is_admin,
        query_params: settings.query_params,
        ...payload,
      });
      return response.data;
    },
    ...options,
    queryKey: sessionDataKey(),
  });

  return query;
};

export default useSessionDataQuery;
