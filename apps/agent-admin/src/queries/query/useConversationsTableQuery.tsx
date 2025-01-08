import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConversationRowData } from '../../admin/api';
import { AxiosResponse } from 'axios';
import { ConversationsTableResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';

type ConversationTableVariables = ConversationsPayload;

const getConversationsTableKey = (payload: ConversationTableVariables, tenantName: string): unknown[] => [
  'conversations-table',
  payload,
  tenantName,
];

type ConversationsTableDataKey = ReturnType<typeof getConversationsTableKey>;

interface Iprops {
  payload: ConversationTableVariables;
  tenantName: string;
  queryOptions: BreakoutQueryOptions<ConversationsTableResponse, ConversationsTableDataKey>;
}

const useConversationsTableQuery = ({
  payload,
  tenantName,
  queryOptions,
}: Iprops): UseQueryResult<ConversationsTableResponse> => {
  const conversationsQuery = useQuery({
    queryKey: getConversationsTableKey(payload, tenantName ?? ''),
    queryFn: async (): Promise<ConversationsTableResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<ConversationsTableResponse> = await getConversationRowData(payload);
      return response.data;
    },
    ...queryOptions,
  });

  return conversationsQuery;
};

export default useConversationsTableQuery;
