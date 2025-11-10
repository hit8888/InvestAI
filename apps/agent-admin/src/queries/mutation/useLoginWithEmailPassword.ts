import { loginWithEmailPassword } from '@meaku/core/adminHttp/api';
import { LoginWithEmailPasswordPayload } from '@meaku/core/types/admin/api';
import { useMutation, UseMutationOptions, useMutationState } from '@tanstack/react-query';
import { processLoginResponse } from '../../utils/apiCalls';

type LoginWithEmailPasswordResult = ReturnType<typeof loginWithEmailPassword> extends Promise<infer T> ? T : never;

type LoginWithEmailPasswordVariables = LoginWithEmailPasswordPayload;

export const LOGIN_WITH_EMAIL_PASSWORD_MUTATION_KEY = 'login-with-email-password';

const useLoginWithEmailPassword = (
  options?: Omit<
    UseMutationOptions<LoginWithEmailPasswordResult, Error, LoginWithEmailPasswordVariables>,
    'mutationFn'
  >,
) => {
  const mutation = useMutation({
    mutationKey: [LOGIN_WITH_EMAIL_PASSWORD_MUTATION_KEY],
    mutationFn: async (payload) => {
      const response = await loginWithEmailPassword(payload);
      return processLoginResponse(response);
    },
    ...options,
  });

  return mutation;
};

export const useLoginWithEmailPasswordMutationState = () => {
  return useMutationState({
    filters: {
      mutationKey: [LOGIN_WITH_EMAIL_PASSWORD_MUTATION_KEY],
    },
    select: (mutation) => mutation.state.data,
  }).at(0);
};

export default useLoginWithEmailPassword;
