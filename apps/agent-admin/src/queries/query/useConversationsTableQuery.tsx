import { ConversationsPayload } from '@neuraltrade/core/types/admin/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConversationRowData } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { ConversationsTableResponse } from '@neuraltrade/core/types/admin/admin';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

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
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
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
