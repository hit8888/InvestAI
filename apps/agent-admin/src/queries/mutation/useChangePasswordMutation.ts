import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { changePassword } from '@neuraltrade/core/adminHttp/api';
import { ChangePasswordPayload } from '@neuraltrade/core/types/admin/api';
import { AxiosError } from 'axios';

type ChangePasswordResult = ReturnType<typeof changePassword> extends Promise<infer T> ? T : never;
type ChangePasswordVariables = ChangePasswordPayload;

interface ChangePasswordErrorResponse {
  confirm_password?: string[];
  new_password?: string[];
}

const useChangePasswordMutation = (
  options?: Omit<
    UseMutationOptions<ChangePasswordResult, AxiosError<ChangePasswordErrorResponse>, ChangePasswordVariables>,
    'mutationFn'
  >,
) => {
  const mutation = useMutation({
    mutationFn: changePassword,
    ...options,
  });

  return mutation;
};

export default useChangePasswordMutation;
