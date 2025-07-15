import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { getDataSourcesQuery } from '@meaku/core/adminHttp/api';
import { DataSourcePayload } from '@meaku/core/types/admin/api';
import { AxiosResponse } from 'axios';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

// Types for data source query response
export interface DataSourceResult {
  id: number;
  version: string;
  data_source_type: string;
  name: string;
  source_url: string;
  status: string;
  created_on: string;
  updated_on: string;
}

export interface DataSourcesQueryResponse {
  total_pages: number;
  total_records: number;
  current_page: number;
  page_size: number;
  results: DataSourceResult[];
}

const getDataSourcesQueryKey = (tenantName: string, payload: DataSourcePayload): unknown[] => [
  'data-sources-query',
  tenantName,
  payload,
];

type DataSourcesQueryKey = ReturnType<typeof getDataSourcesQueryKey>;

interface IProps {
  payload: DataSourcePayload;
  queryOptions?: BreakoutQueryOptions<DataSourcesQueryResponse, DataSourcesQueryKey>;
}

const useDataSourcesQuery = ({ payload, queryOptions }: IProps): UseQueryResult<DataSourcesQueryResponse> => {
  const tenantName = getTenantFromLocalStorage();

  return useQuery({
    queryKey: getDataSourcesQueryKey(tenantName ?? '', payload),
    queryFn: async (): Promise<DataSourcesQueryResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<DataSourcesQueryResponse> = await getDataSourcesQuery(payload);
      return response.data;
    },
    ...queryOptions,
  });
};

export const useInfiniteDataSourcesQuery = ({
  payload,
  queryOptions,
}: IProps): UseInfiniteQueryResult<DataSourcesQueryResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const { enabled } = queryOptions || {};
  return useInfiniteQuery({
    queryKey: getDataSourcesQueryKey(tenantName ?? '', payload),
    queryFn: async ({ pageParam = 1 }) => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<DataSourcesQueryResponse> = await getDataSourcesQuery({
        ...payload,
        page: pageParam,
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: typeof enabled === 'boolean' ? enabled : true,
  });
};

export function isInfiniteDataSources(data: unknown): data is InfiniteData<DataSourcesQueryResponse, number> {
  return (
    typeof data === 'object' && data !== null && 'pages' in data && Array.isArray((data as { pages: unknown }).pages)
  );
}

export default useDataSourcesQuery;
