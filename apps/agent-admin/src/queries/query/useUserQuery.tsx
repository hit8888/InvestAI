import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getUserById } from '@meaku/core/adminHttp/api';
import { UserManagementResponse } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

type BreakoutQueryOptions<TData, TQueryKey extends readonly unknown[]> = Omit<
  UseQueryOptions<TData, Error, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>;

type UserQueryKey = ['user', string | null, number];

interface UseUserQueryProps {
  userId: number | null;
  queryOptions?: BreakoutQueryOptions<UserManagementResponse, UserQueryKey>;
}

const useUserQuery = ({ userId, queryOptions }: UseUserQueryProps): UseQueryResult<UserManagementResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name'] ?? null);
  const { enabled: enabledOption = true, ...restQueryOptions } = queryOptions ?? {};

  return useQuery({
    queryKey: ['user', tenantName, userId ?? 0] as UserQueryKey,
    queryFn: async (): Promise<UserManagementResponse> => {
      if (!tenantName) {
        throw new Error('Tenant name is undefined');
      }

      if (!userId) {
        throw new Error('User id is undefined');
      }

      const response = await getUserById(userId);
      return response.data;
    },
    enabled: Boolean(tenantName && userId) && enabledOption,
    ...restQueryOptions,
  });
};

export default useUserQuery;
