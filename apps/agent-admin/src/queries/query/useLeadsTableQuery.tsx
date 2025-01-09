import { LeadsPayload } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getLeadsRowData } from '../../admin/api';
import { AxiosResponse } from 'axios';
import { LeadsTableResponse } from '@meaku/core/types/admin/admin';

type LeadsTableVariables = LeadsPayload;

const getLeadsTableKey = (payload: LeadsTableVariables, tenantName: string): unknown[] => [
  'leads-table',
  payload,
  tenantName,
];

type LeadsTableDataKey = ReturnType<typeof getLeadsTableKey>;

interface IProps {
  payload: LeadsTableVariables;
  tenantName: string;
  queryOptions: BreakoutQueryOptions<LeadsTableResponse, LeadsTableDataKey>;
}

const useLeadsTableQuery = ({ payload, tenantName, queryOptions }: IProps): UseQueryResult<LeadsTableResponse> => {
  const leadsQuery = useQuery({
    queryKey: getLeadsTableKey(payload, tenantName ?? ''),
    queryFn: async (): Promise<LeadsTableResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<LeadsTableResponse> = await getLeadsRowData(payload);
      return response.data;
    },
    ...queryOptions,
  });

  return leadsQuery;
};

export default useLeadsTableQuery;
