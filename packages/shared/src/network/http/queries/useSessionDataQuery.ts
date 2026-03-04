import { useRef } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { initializeSession } from '../api';
import type { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import type { InitializationPayload } from '@neuraltrade/core/types/api/session_init_request';
import type { InitSessionResponse } from '../../../types/responses';
import { useCommandBarStore } from '../../../stores';

const sessionDataKey = (): unknown[] => ['session-data'];

type SessionDataKey = ReturnType<typeof sessionDataKey>;

type SessionDataQueryPayload = Partial<InitializationPayload> & {
  agentId?: string;
};

const MAX_RETRY_COUNT = 3;

const useSessionDataQuery = (
  payload: SessionDataQueryPayload,
  options: BreakoutQueryOptions<InitSessionResponse, SessionDataKey> = {},
): UseQueryResult<InitSessionResponse> => {
  const retryCount = useRef(0);
  const { settings, config } = useCommandBarStore();

  const query = useQuery({
    queryKey: sessionDataKey(),
    queryFn: async () => {
      const isMaxRetryExceeded = retryCount.current === MAX_RETRY_COUNT - 1;

      const response = await initializeSession(settings.agent_id, {
        session_id: isMaxRetryExceeded ? null : config.session_id,
        prospect_id: isMaxRetryExceeded ? null : config.prospect_id,
        is_test: settings.is_test,
        is_admin: settings.is_admin,
        query_params: settings.query_params,
        command_bar: true,
        ...payload,
      });
      return response.data;
    },
    retry: (failureCount) => {
      retryCount.current = failureCount;
      return failureCount < MAX_RETRY_COUNT;
    },
    ...options,
  });

  return query;
};

export default useSessionDataQuery;
