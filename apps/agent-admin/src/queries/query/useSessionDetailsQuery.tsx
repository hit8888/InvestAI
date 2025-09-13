import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSessionDetailsData } from '@meaku/core/adminHttp/api';
import { SessionDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

const getSessionDetailsDataKey = (tenantName: string, sessionID: string): unknown[] => [
  'session-details-data',
  tenantName,
  sessionID,
];

type SessionDetailsDataKey = ReturnType<typeof getSessionDetailsDataKey>;

type SessionDetailsDataQueryPayload = {
  sessionId?: string;
};

type SessionDetailsDataQueryOptions = BreakoutQueryOptions<SessionDetailsDataResponse, SessionDetailsDataKey>;

const useSessionDetailsQuery = (
  payload: SessionDetailsDataQueryPayload = {},
  options: SessionDetailsDataQueryOptions = {},
): UseQueryResult<SessionDetailsDataResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const sessionId = payload.sessionId;

  const sessionDetailsDataQuery = useQuery({
    queryKey: getSessionDetailsDataKey(tenantName, sessionId!),
    queryFn: async () => {
      const response = await getSessionDetailsData(sessionId!);
      return response.data;
    },
    enabled: !!sessionId,
    ...options,
  });

  return sessionDetailsDataQuery;
};

export default useSessionDetailsQuery;
