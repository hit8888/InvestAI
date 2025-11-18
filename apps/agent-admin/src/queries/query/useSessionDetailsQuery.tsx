import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const sessionId = payload.sessionId;
  const prospectId = payload.prospectId;

  const sessionDetailsDataQuery = useQuery({
    queryKey: getSessionDetailsDataKey(tenantName, sessionId ?? '', prospectId ?? ''),
    queryFn: async () => {
      let data: SessionDetailsDataResponse;

      if (prospectId) {
        const response = await getSessionDetailsByProspectId(prospectId);
        data = response.data;
      } else if (sessionId) {
        const response = await getSessionDetailsBySessionId(sessionId);
        data = response.data;
      } else {
        throw new Error('Either prospectId or sessionId is required');
      }

      // Cache the data under the alternate key (sessionId if fetched by prospectId, prospectId if fetched by sessionId)
      const alternateSessionId = prospectId ? (data.session?.session_id ?? '') : '';
      const alternateProspectId = sessionId ? (data.prospect?.prospect_id ?? '') : '';

      if (alternateSessionId || alternateProspectId) {
        const alternateKey = getSessionDetailsDataKey(tenantName, alternateSessionId, alternateProspectId);
        queryClient.setQueryData(alternateKey, data);
      }

      return data;
    },
    enabled: !!sessionId || !!prospectId,
    ...options,
  });

  return sessionDetailsDataQuery;
};

export default useSessionDetailsQuery;
