import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getUserProfile } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { UserProfileResponse } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

const getUserProfileKey = (tenantName: string): unknown[] => ['user-profile', tenantName];

type UserProfileDataKey = ReturnType<typeof getUserProfileKey>;

interface IProps {
  queryOptions?: BreakoutQueryOptions<UserProfileResponse, UserProfileDataKey>;
}

const useUserProfileQuery = ({ queryOptions }: IProps = {}): UseQueryResult<UserProfileResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const userProfileQuery = useQuery({
    queryKey: getUserProfileKey(tenantName ?? ''),
    queryFn: async (): Promise<UserProfileResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<UserProfileResponse> = await getUserProfile();
      return response.data;
    },
    ...queryOptions,
    refetchOnMount: 'always',
  });

  return userProfileQuery;
};

export default useUserProfileQuery;
