import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getUsersList } from '@meaku/core/adminHttp/api';
import { UsersListResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

type BreakoutQueryOptions<TData, TQueryKey extends readonly unknown[]> = Omit<
  UseQueryOptions<TData, Error, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>;

interface IProps {
  queryOptions?: BreakoutQueryOptions<UsersListResponse, readonly unknown[]>;
}

const useUsersListQuery = ({ queryOptions }: IProps = {}): UseQueryResult<UsersListResponse> => {
  const tenantName = getTenantFromLocalStorage();

  const usersListQuery = useQuery({
    queryKey: ['users-list', tenantName],
    queryFn: async (): Promise<UsersListResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<UsersListResponse> = await getUsersList();
      return response.data;
    },
    ...queryOptions,
  });

  return usersListQuery;
};

export default useUsersListQuery;
