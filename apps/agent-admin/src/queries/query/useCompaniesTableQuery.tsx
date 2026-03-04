import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getCompaniesRowData } from '@neuraltrade/core/adminHttp/api';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { CompaniesPayload, CompaniesTableResponseSchema } from '@neuraltrade/core/types/admin/api';
import { z } from 'zod';
import { useSessionStore } from '../../stores/useSessionStore';

type CompaniesTableResponse = z.infer<typeof CompaniesTableResponseSchema>;

const getCompaniesTableKey = (payload: CompaniesPayload, tenantName: string): readonly unknown[] => [
  'companies-table',
  payload,
  tenantName,
];

type CompaniesTableDataKey = ReturnType<typeof getCompaniesTableKey>;

interface IProps {
  payload: CompaniesPayload;
  queryOptions: BreakoutQueryOptions<CompaniesTableResponse, CompaniesTableDataKey>;
}

const useCompaniesTableQuery = ({ payload, queryOptions }: IProps): UseQueryResult<CompaniesTableResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const companiesQuery = useQuery({
    queryKey: getCompaniesTableKey(payload, tenantName ?? ''),
    queryFn: async (): Promise<CompaniesTableResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<CompaniesTableResponse> = await getCompaniesRowData(payload);
      return response.data;
    },
    ...queryOptions,
  });

  return companiesQuery;
};

export default useCompaniesTableQuery;
