import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { getUsersList } from '@meaku/core/adminHttp/api';
import { UsersListQueryParams, UsersListResponse } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';
import { AxiosResponse } from 'axios';

type BreakoutQueryOptions<TData, TQueryKey extends readonly unknown[]> = Omit<
  UseQueryOptions<TData, Error, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>;

type UsersListQueryKey = ['users-list', string | null, UsersListQueryParams];

interface UseUsersListQueryProps {
  params?: UsersListQueryParams;
  queryOptions?: BreakoutQueryOptions<UsersListResponse, UsersListQueryKey>;
}

const useUsersListQuery = ({
  params = {},
  queryOptions,
}: UseUsersListQueryProps = {}): UseQueryResult<UsersListResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name'] ?? null);
  const { enabled: enabledOption = true, ...restQueryOptions } = queryOptions ?? {};

  const usersListQuery = useQuery({
    queryKey: ['users-list', tenantName, params] as UsersListQueryKey,
    queryFn: async (): Promise<UsersListResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<UsersListResponse> = await getUsersList(params);
      return response.data;
    },
    enabled: Boolean(tenantName) && enabledOption,
    ...restQueryOptions,
  });

  return usersListQuery;
};

export default useUsersListQuery;
