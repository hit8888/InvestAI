import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSessionDetailsBySessionId } from '@meaku/core/adminHttp/api';
import { ConversationDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { normalizeSessionToConversationData } from '../../utils/common';

const getConversationDetailsDataKey = (tenantName: string, sessionID: string): unknown[] => [
  'conversation-details-data',
  tenantName,
  sessionID,
];

type ConversationDetailsDataKey = ReturnType<typeof getConversationDetailsDataKey>;

interface IProps {
  sessionID: string;
  queryOptions: BreakoutQueryOptions<ConversationDetailsDataResponse, ConversationDetailsDataKey>;
}

const useConversationDetailsDataQuery = ({
  sessionID,
  queryOptions,
}: IProps): UseQueryResult<ConversationDetailsDataResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const detailsQuery = useQuery({
    queryKey: getConversationDetailsDataKey(tenantName ?? '', sessionID ?? ''),
    queryFn: async (): Promise<ConversationDetailsDataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      if (!sessionID) throw new Error('Session ID is undefined');
      const response = await getSessionDetailsBySessionId(sessionID);
      return normalizeSessionToConversationData(response.data);
    },
    enabled: !!sessionID,
    ...queryOptions,
  });

  return detailsQuery;
};

export default useConversationDetailsDataQuery;
