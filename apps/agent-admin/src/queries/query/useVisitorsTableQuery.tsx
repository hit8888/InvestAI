import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getVisitorsRowData } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { VisitorsTableResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

type ConversationTableVariables = ConversationsPayload;

const getVisitorsTableKey = (payload: ConversationTableVariables, tenantName: string): unknown[] => [
  'prospects-table',
  JSON.stringify(payload),
  tenantName,
];

type VisitorsTableDataKey = ReturnType<typeof getVisitorsTableKey>;

interface IProps {
  payload: ConversationTableVariables;
  queryOptions: BreakoutQueryOptions<VisitorsTableResponse, VisitorsTableDataKey>;
}

const useVisitorsTableQuery = ({ payload, queryOptions }: IProps): UseQueryResult<VisitorsTableResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const visitorsQuery = useQuery({
    queryKey: getVisitorsTableKey(payload, tenantName ?? ''),
    queryFn: async (): Promise<VisitorsTableResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<VisitorsTableResponse> = await getVisitorsRowData(payload);
      return response.data;
    },
    ...queryOptions,
  });

  return visitorsQuery;
};

export default useVisitorsTableQuery;
