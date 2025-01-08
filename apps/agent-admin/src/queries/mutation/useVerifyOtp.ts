import { verifyOtp } from '../../admin/api';
import { VerifyOtpPayload } from '@meaku/core/types/admin/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type VerifyOtpResult = ReturnType<typeof verifyOtp> extends Promise<infer T> ? T : never;

type VerifyOtpVariables = VerifyOtpPayload;

const useVerifyOtp = (options?: Omit<UseMutationOptions<VerifyOtpResult, Error, VerifyOtpVariables>, 'mutationFn'>) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await verifyOtp(payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useVerifyOtp;
