import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFilterOptionsData } from '../../admin/api';
import { AxiosResponse } from 'axios';
import { FilterOptionsPayload, FilterOptionsResponse } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';

type FilterOptionsVariables = FilterOptionsPayload;

const getFilterOptionsDataKey = (payload: FilterOptionsVariables, tenantName: string, page: string): unknown[] => [
  'filter-options-data',
  payload,
  tenantName,
  page,
];

type FilterOptionsDataKey = ReturnType<typeof getFilterOptionsDataKey>;

interface IProps {
  payload: FilterOptionsVariables;
  tenantName: string;
  page: string;
  queryOptions: BreakoutQueryOptions<FilterOptionsResponse, FilterOptionsDataKey>;
}

const useFilterOptionsDataQuery = ({
  payload,
  tenantName,
  page,
  queryOptions,
}: IProps): UseQueryResult<FilterOptionsResponse> => {
  const filterQuery = useQuery({
    queryKey: getFilterOptionsDataKey(payload, tenantName ?? '', page),
    queryFn: async (): Promise<FilterOptionsResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<FilterOptionsResponse> = await getFilterOptionsData(payload, page);
      return response.data;
    },
    ...queryOptions,
  });

  return filterQuery;
};

export default useFilterOptionsDataQuery;
