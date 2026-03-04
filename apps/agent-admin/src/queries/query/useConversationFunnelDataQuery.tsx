import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConversationFunnelData } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { ConversationsFunnelDataResponse } from '@neuraltrade/core/types/admin/admin';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';

const getConversationsFunnelDataKey = (tenantName: string): unknown[] => ['conversations-funnel-data', tenantName];

type ConversationsFunnelDataKey = ReturnType<typeof getConversationsFunnelDataKey>;

interface IProps {
  tenantName: string;
  queryOptions: BreakoutQueryOptions<ConversationsFunnelDataResponse, ConversationsFunnelDataKey>;
}

const useConversationsFunnelDataQuery = ({
  tenantName,
  queryOptions,
}: IProps): UseQueryResult<ConversationsFunnelDataResponse> => {
  const funnelQuery = useQuery({
    queryKey: getConversationsFunnelDataKey(tenantName ?? ''),
    queryFn: async (): Promise<ConversationsFunnelDataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<ConversationsFunnelDataResponse> = await getConversationFunnelData();
      return response.data;
    },
    ...queryOptions,
  });

  return funnelQuery;
};

export default useConversationsFunnelDataQuery;
