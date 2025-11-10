import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSessionDetailsByProspectId, getSessionDetailsBySessionId } from '@meaku/core/adminHttp/api';
import { SessionDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

const getSessionDetailsDataKey = (tenantName: string, sessionID?: string, prospectId?: string): unknown[] => [
  'session-details-data',
  tenantName,
  sessionID,
  prospectId,
];

type SessionDetailsDataKey = ReturnType<typeof getSessionDetailsDataKey>;

type SessionDetailsDataQueryPayload = {
  sessionId?: string;
  prospectId?: string;
};

type SessionDetailsDataQueryOptions = BreakoutQueryOptions<SessionDetailsDataResponse, SessionDetailsDataKey>;

const useSessionDetailsQuery = (
  payload: SessionDetailsDataQueryPayload = {},
  options: SessionDetailsDataQueryOptions = {},
): UseQueryResult<SessionDetailsDataResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';
  const sessionId = payload.sessionId;
  const prospectId = payload.prospectId;

  const sessionDetailsDataQuery = useQuery({
    queryKey: getSessionDetailsDataKey(tenantName ?? '', sessionId, prospectId),
    queryFn: async () => {
      if (prospectId) {
        const response = await getSessionDetailsByProspectId(prospectId);
        return response.data;
      } else if (sessionId) {
        const response = await getSessionDetailsBySessionId(sessionId);
        return response.data;
      }

      throw new Error('Either prospectId or sessionId is required');
    },
    enabled: !!sessionId || !!prospectId,
    ...options,
  });

  return sessionDetailsDataQuery;
};

export default useSessionDetailsQuery;
