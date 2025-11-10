import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getDataSourceFilterOptionsData } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { FilterOptionsPayload, FilterOptionsResponse } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { PageTypeToTableName } from '@meaku/core/utils/index';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { useSessionStore } from '../../stores/useSessionStore';

type FilterOptionsVariables = FilterOptionsPayload;

const getDataSourceFilterOptionsDataKey = (
  payload: FilterOptionsVariables,
  tenantName: string,
  page: string,
): unknown[] => ['data-source-filter-options-data', payload, tenantName, page];

type DataSourceFilterOptionsDataKey = ReturnType<typeof getDataSourceFilterOptionsDataKey>;

interface IProps {
  payload: FilterOptionsVariables;
  page: PaginationPageType;
  queryOptions: BreakoutQueryOptions<FilterOptionsResponse, DataSourceFilterOptionsDataKey>;
}

const useDataSourceFilterOptionsDataQuery = ({
  payload,
  page,
  queryOptions,
}: IProps): UseQueryResult<FilterOptionsResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const filterQuery = useQuery({
    queryKey: getDataSourceFilterOptionsDataKey(payload, tenantName ?? '', page),
    queryFn: async (): Promise<FilterOptionsResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<FilterOptionsResponse> = await getDataSourceFilterOptionsData(
        payload,
        PageTypeToTableName[page],
      );
      return response.data;
    },
    ...queryOptions,
  });

  return filterQuery;
};

export default useDataSourceFilterOptionsDataQuery;
