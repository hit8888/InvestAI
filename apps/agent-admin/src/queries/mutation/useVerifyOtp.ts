import { verifyOtp } from '@neuraltrade/core/adminHttp/api';
import { VerifyOtpPayload } from '@neuraltrade/core/types/admin/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { processLoginResponse } from '../../utils/apiCalls';

type VerifyOtpResult = ReturnType<typeof verifyOtp> extends Promise<infer T> ? T : never;

type VerifyOtpVariables = VerifyOtpPayload;

const useVerifyOtp = (options?: Omit<UseMutationOptions<VerifyOtpResult, Error, VerifyOtpVariables>, 'mutationFn'>) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await verifyOtp(payload);
      return processLoginResponse(response);
    },
    ...options,
  });

  return mutation;
};

export default useVerifyOtp;
