import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDataSourceOverviewData } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { DataSourceOverviewDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

const getDataSourceOverviewDataKey = (tenantName: string): unknown[] => ['data-source-overview-data', tenantName];

type DataSourceOverviewDataKey = ReturnType<typeof getDataSourceOverviewDataKey>;

interface IProps {
  queryOptions: BreakoutQueryOptions<DataSourceOverviewDataResponse, DataSourceOverviewDataKey>;
}

const useDataSourceOverviewDataQuery = ({ queryOptions }: IProps): UseQueryResult<DataSourceOverviewDataResponse> => {
  const tenantName = getTenantFromLocalStorage();
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
