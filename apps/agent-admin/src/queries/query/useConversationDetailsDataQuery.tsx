import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConversationDetailsData } from '../../admin/api';
import { AxiosResponse } from 'axios';
import { ConversationDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '../../utils/common';

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
      // Fetch data with `fetch_all`
      const response: AxiosResponse<ConversationDetailsDataResponse> = await getConversationDetailsData(sessionID);
      return response.data;
    },
    ...queryOptions,
  });

  return detailsQuery;
};

export default useConversationDetailsDataQuery;
