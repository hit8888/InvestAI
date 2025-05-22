import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { postResponseFeedback } from '../../http/api';
import { FeedbackRequestPayload } from '../../types/api/feedback_request';
import { ViewType } from '../../types';

type ResponseFeedbackResult = ReturnType<typeof postResponseFeedback> extends Promise<infer T> ? T : never;

type ResponseFeedbackVariables = {
  viewType: ViewType;
  sessionId: string;
  payload: FeedbackRequestPayload;
};

const useResponseFeedback = (
  options?: Omit<UseMutationOptions<ResponseFeedbackResult, Error, ResponseFeedbackVariables>, 'mutationFn'>,
) => {
  const mutation = useMutation({
    mutationKey: ['post-response-feedback'],
    mutationFn: async ({ viewType, sessionId, payload }: ResponseFeedbackVariables) => {
      const response = await postResponseFeedback(sessionId, payload, viewType);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useResponseFeedback;
