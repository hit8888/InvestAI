import { reachoutEmail } from '@meaku/core/adminHttp/api';
import { ReachoutEmailPayload, ReachoutEmailResponse } from '@meaku/core/types/admin/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type ReachoutEmailVariables = ReachoutEmailResponse;

const useReachoutEmailQuery = (
  payload: ReachoutEmailPayload,
  options?: Omit<UseQueryOptions<ReachoutEmailResponse, Error, ReachoutEmailVariables>, 'queryKey' | 'queryFn'>,
) => {
  const query = useQuery({
    queryKey: ['reachoutEmail', payload],
    queryFn: async () => {
      try {
        const response = await reachoutEmail(payload);
        return response.data.data;
      } catch (error) {
        toast.error('Error generating email');
        throw error;
      }
    },
    ...options,
  });

  return query;
};

export default useReachoutEmailQuery;
