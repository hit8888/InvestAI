import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getActiveConversationDetailsData } from '../../admin/api';
import { AxiosResponse } from 'axios';
import { ActiveConversationDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '../../utils/common';

const getActiveConversationDetailsDataKey = (tenantName: string, sessionID: string): unknown[] => [
  'active-conversation-details-data',
  tenantName,
  sessionID,
];

type ActiveConversationDetailsDataKey = ReturnType<typeof getActiveConversationDetailsDataKey>;

interface IProps {
  sessionID: string;
  queryOptions: BreakoutQueryOptions<ActiveConversationDetailsDataResponse, ActiveConversationDetailsDataKey>;
  queryParams?: Record<string, string>;
}

const useActiveConversationDetailsDataQuery = ({
  sessionID,
  queryOptions,
  queryParams,
}: IProps): UseQueryResult<ActiveConversationDetailsDataResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const detailsQuery = useQuery({
    queryKey: getActiveConversationDetailsDataKey(tenantName ?? '', sessionID ?? ''),
    queryFn: async (): Promise<ActiveConversationDetailsDataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<ActiveConversationDetailsDataResponse> = await getActiveConversationDetailsData(
        sessionID,
        queryParams,
      );
      return response.data;
    },
    ...queryOptions,
  });

  return detailsQuery;
};

export default useActiveConversationDetailsDataQuery;
