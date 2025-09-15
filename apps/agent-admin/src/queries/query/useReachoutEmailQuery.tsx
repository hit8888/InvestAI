import { reachoutEmail } from '@meaku/core/adminHttp/api';
import { ReachoutEmailPayload, ReachoutEmailResponse } from '@meaku/core/types/admin/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type ReachoutEmailVariables = ReachoutEmailResponse;

const useReachoutEmailQuery = (
  payload: ReachoutEmailPayload,
  options?: Omit<UseQueryOptions<ReachoutEmailResponse, Error, ReachoutEmailVariables>, 'queryKey' | 'queryFn'>,
) => {
  const query = useQuery({
    queryKey: ['reachoutEmail', payload],
    queryFn: async () => {
      const response = await reachoutEmail(payload);

      return response.data.data;
    },
    ...options,
  });

  return query;
};

export default useReachoutEmailQuery;
