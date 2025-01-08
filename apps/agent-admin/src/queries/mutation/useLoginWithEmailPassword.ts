import { loginWithEmailPassword } from '../../admin/api';
import { LoginWithEmailPasswordPayload } from '@meaku/core/types/admin/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type LoginWithEmailPasswordResult = ReturnType<typeof loginWithEmailPassword> extends Promise<infer T> ? T : never;

type LoginWithEmailPasswordVariables = LoginWithEmailPasswordPayload;

const useLoginWithEmailPassword = (
  options?: Omit<
    UseMutationOptions<LoginWithEmailPasswordResult, Error, LoginWithEmailPasswordVariables>,
    'mutationFn'
  >,
) => {
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await loginWithEmailPassword(payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useLoginWithEmailPassword;
