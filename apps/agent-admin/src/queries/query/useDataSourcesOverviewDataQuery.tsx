import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDataSourceOverviewData } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { DataSourceOverviewDataResponse } from '@neuraltrade/core/types/admin/admin';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

const getDataSourceOverviewDataKey = (tenantName: string): unknown[] => ['data-source-overview-data', tenantName];

type DataSourceOverviewDataKey = ReturnType<typeof getDataSourceOverviewDataKey>;

interface IProps {
  queryOptions: BreakoutQueryOptions<DataSourceOverviewDataResponse, DataSourceOverviewDataKey>;
}

const useDataSourceOverviewDataQuery = ({ queryOptions }: IProps): UseQueryResult<DataSourceOverviewDataResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const overviewDataQuery = useQuery({
    queryKey: getDataSourceOverviewDataKey(tenantName ?? ''),
    queryFn: async (): Promise<DataSourceOverviewDataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<DataSourceOverviewDataResponse> = await getDataSourceOverviewData();
      return response.data;
    },
    ...queryOptions,
  });

  return overviewDataQuery;
};

export default useDataSourceOverviewDataQuery;
