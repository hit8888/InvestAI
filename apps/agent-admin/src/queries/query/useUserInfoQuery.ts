import { useQuery } from '@tanstack/react-query';
import { UseQueryResult } from '@tanstack/react-query';

import { getUserDataFromMeAPI } from '@neuraltrade/core/adminHttp/api';
import { UserInfoResponse } from '@neuraltrade/core/types/admin/api';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';

const getUserInfoKey = (): unknown[] => ['user-info'];

type UserInfoKey = ReturnType<typeof getUserInfoKey>;

type UserInfoQueryOptions = BreakoutQueryOptions<UserInfoResponse, UserInfoKey>;

const useUserInfoQuery = (options: UserInfoQueryOptions = {}): UseQueryResult<UserInfoResponse> => {
  return useQuery({
    queryKey: getUserInfoKey(),
    queryFn: async () => {
      const response = await getUserDataFromMeAPI();
      const organizations = response?.data?.organizations?.filter((org) => org['tenant-name'] !== '') ?? [];

      if (organizations.length > 0) {
        organizations.sort((a, b) => a.name?.localeCompare(b.name ?? '') ?? 0);
      }

      response.data.organizations = organizations;
      return response.data;
    },
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useUserInfoQuery;
