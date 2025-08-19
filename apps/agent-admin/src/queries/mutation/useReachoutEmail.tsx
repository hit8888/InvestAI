import { reachoutEmail } from '@meaku/core/adminHttp/api';
import { ReachoutEmailPayload, ReachoutEmailResponse } from '@meaku/core/types/admin/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type ReachoutEmailVariables = ReachoutEmailPayload;

const useReachoutEmail = (
  options?: Omit<UseMutationOptions<ReachoutEmailResponse, Error, ReachoutEmailVariables>, 'mutationFn'>,
) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await reachoutEmail(payload);

      return response.data.data;
    },
    ...options,
  });

  return mutation;
};

export default useReachoutEmail;
