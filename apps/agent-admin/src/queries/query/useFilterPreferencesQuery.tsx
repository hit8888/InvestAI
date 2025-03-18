import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFilterPreferences } from '../../admin/api';
import { AxiosError, AxiosResponse } from 'axios';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '../../utils/common';
import { FilterPreferencesResponseType } from '@meaku/core/types/admin/api';

const getFilterPreferencesKey = (tableName: string, tenantName: string): readonly unknown[] => [
  'filter-preferences',
  tableName,
  tenantName,
];

interface IProps {
  tableName: string;
  queryOptions: BreakoutQueryOptions<FilterPreferencesResponseType, readonly unknown[]>;
}

const useFilterPreferencesQuery = ({
  tableName,
  queryOptions,
}: IProps): UseQueryResult<FilterPreferencesResponseType> => {
  const tenantName = getTenantFromLocalStorage();
  return useQuery({
    queryKey: getFilterPreferencesKey(tableName, tenantName ?? ''),
    queryFn: async (): Promise<FilterPreferencesResponseType> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      try {
        const response: AxiosResponse<FilterPreferencesResponseType> = await getFilterPreferences(tableName);
        return response.data;
      } catch (error) {
        // If it's a 404 error, return a default empty response
        if (error instanceof AxiosError && error.response?.status === 404) {
          return {
            id: 0,
            table_name: tableName,
            filter_data: {
              sort: [],
              filters: [],
            },
            source: 'organization',
          };
        }
        throw error; // Re-throw other errors
      }
    },
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 error
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      // For other errors, retry up to 3 times
      return failureCount < 3;
    },
    ...queryOptions,
  });
};

export default useFilterPreferencesQuery;
