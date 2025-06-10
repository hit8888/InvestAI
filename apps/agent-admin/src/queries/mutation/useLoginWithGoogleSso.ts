import { loginWithGoogleSso } from '@meaku/core/adminHttp/api';
import { LoginWithGoogleSsoPayload } from '@meaku/core/types/admin/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type LoginWithGoogleSsoResult = ReturnType<typeof loginWithGoogleSso> extends Promise<infer T> ? T : never;

type LoginWithGoogleSsoVariables = LoginWithGoogleSsoPayload;

const useLoginWithGoogleSso = (
  options?: Omit<UseMutationOptions<LoginWithGoogleSsoResult, Error, LoginWithGoogleSsoVariables>, 'mutationFn'>,
) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await loginWithGoogleSso(payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useLoginWithGoogleSso;
