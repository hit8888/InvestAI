import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';

import { updateUserProfile } from '@meaku/core/adminHttp/api';
import {
  UpdateUserProfilePayload,
  UserProfileUpdateResponse,
  UserProfileValidationError,
  UserProfileNotFoundError,
  UserProfileServerError,
} from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

interface MutationVariables {
  data: UpdateUserProfilePayload;
}

// Union type for all possible error responses
export type UserProfileUpdateError = UserProfileValidationError | UserProfileNotFoundError | UserProfileServerError;

interface UseUpdateUserProfileMutationOptions {
  onSuccess?: (data: UserProfileUpdateResponse) => void;
  onError?: (error: AxiosError<UserProfileUpdateError>) => void;
}

const useUpdateUserProfileMutation = (
  options?: UseUpdateUserProfileMutationOptions,
): UseMutationResult<UserProfileUpdateResponse, AxiosError<UserProfileUpdateError>, MutationVariables> => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useMutation({
    mutationFn: async ({ data }: MutationVariables): Promise<UserProfileUpdateResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<UserProfileUpdateResponse> = await updateUserProfile(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the user profile query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['user-profile', tenantName],
      });

      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError<UserProfileUpdateError>) => {
      console.error('Error updating user profile:', error);

      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
};

export default useUpdateUserProfileMutation;
