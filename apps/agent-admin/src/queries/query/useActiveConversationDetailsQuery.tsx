import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getActiveConversationDetailsData } from '@meaku/core/adminHttp/api';
import { ActiveConversationDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import useJoinConversationStore from '../../stores/useJoinConversationStore';

const getActiveConversationDetailsDataKey = (tenantName: string, sessionID: string): unknown[] => [
  'active-conversation-details-data',
  tenantName,
  sessionID,
];

type ActiveConversationDetailsDataKey = ReturnType<typeof getActiveConversationDetailsDataKey>;

type ActiveConversationDetailsDataQueryPayload = {
  sessionId?: string;
};

type ActiveConversationDetailsDataQueryOptions = BreakoutQueryOptions<
  ActiveConversationDetailsDataResponse,
  ActiveConversationDetailsDataKey
>;

const useActiveConversationDetailsQuery = (
  payload: ActiveConversationDetailsDataQueryPayload = {},
  options: ActiveConversationDetailsDataQueryOptions = {},
): UseQueryResult<ActiveConversationDetailsDataResponse> => {
  const { currentConversation } = useJoinConversationStore();
  const tenantName = getTenantFromLocalStorage();
  const sessionId = payload.sessionId ?? currentConversation?.session_id;

  const activeConversationDetailsDataQuery = useQuery({
    queryKey: getActiveConversationDetailsDataKey(tenantName, sessionId!),
    queryFn: async () => {
      const response = await getActiveConversationDetailsData(sessionId!);
      return response.data;
    },
    enabled: !!sessionId,
    ...options,
  });

  return activeConversationDetailsDataQuery;
};

export default useActiveConversationDetailsQuery;
