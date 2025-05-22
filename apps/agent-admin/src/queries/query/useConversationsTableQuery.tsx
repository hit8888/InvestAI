import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConversationRowData } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { ConversationsTableResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

type ConversationTableVariables = ConversationsPayload;

const getConversationsTableKey = (payload: ConversationTableVariables, tenantName: string): unknown[] => [
  'conversations-table',
  JSON.stringify(payload),
  tenantName,
];

type ConversationsTableDataKey = ReturnType<typeof getConversationsTableKey>;

interface IProps {
  payload: ConversationTableVariables;
  queryOptions: BreakoutQueryOptions<ConversationsTableResponse, ConversationsTableDataKey>;
}

const useConversationsTableQuery = ({ payload, queryOptions }: IProps): UseQueryResult<ConversationsTableResponse> => {
  const tenantName = getTenantFromLocalStorage();
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
