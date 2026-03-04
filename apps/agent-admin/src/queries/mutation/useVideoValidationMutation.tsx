import { useMutation } from '@tanstack/react-query';
import { validateVideoUrls } from '@neuraltrade/core/adminHttp/api';
import { VideoValidationRequest, VideoValidationResponse } from '@neuraltrade/core/types/admin/api';
import { AxiosResponse, AxiosError } from 'axios';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';

interface UseVideoValidationMutationOptions {
  onSuccess?: (data: VideoValidationResponse) => void;
  onError?: (error: AxiosError) => void;
  showToasts?: boolean;
}

/**
 * Hook for validating video URLs
 * Handles validation of multiple video URLs and returns success/error results
 * @param options - Configuration options for the mutation
 * @param options.onSuccess - Callback executed on successful validation
 * @param options.onError - Callback executed on error
 * @param options.showToasts - Whether to show toast messages (default: false, handled by component)
 */
export const useVideoValidationMutation = (options?: UseVideoValidationMutationOptions) => {
  return useMutation({
    mutationFn: async (urls: VideoValidationRequest): Promise<VideoValidationResponse> => {
      const response: AxiosResponse<VideoValidationResponse> = await validateVideoUrls(urls);
      return response.data;
    },
    onSuccess: (data) => {
      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError) => {
      console.error('Video validation error:', error);

      // Only show toast if explicitly requested
      if (options?.showToasts) {
        const errorMessage = error.message || 'Please check your internet connection and try again.';
        ErrorToastMessage({
          title: `Failed to validate video URLs - ${errorMessage}`,
        });
      }

      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
};
