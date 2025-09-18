import { useQuery } from '@tanstack/react-query';
import { UseQueryResult } from '@tanstack/react-query';

import { getUserDataFromMeAPI } from '@meaku/core/adminHttp/api';
import { UserInfoResponse } from '@meaku/core/types/admin/api';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';

const getUserInfoKey = (): unknown[] => ['user-info'];

type UserInfoKey = ReturnType<typeof getUserInfoKey>;

type UserInfoQueryOptions = BreakoutQueryOptions<UserInfoResponse, UserInfoKey>;

const useUserInfoQuery = (options: UserInfoQueryOptions = {}): UseQueryResult<UserInfoResponse> => {
  return useQuery({
    queryKey: getUserInfoKey(),
    queryFn: async () => {
      const response = await getUserDataFromMeAPI();
      return response.data;
    },
    ...options,
  });
};

export default useUserInfoQuery;
