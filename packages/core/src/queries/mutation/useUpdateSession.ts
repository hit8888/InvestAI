import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { updateSession } from '../../http/api';
import { UpdateSessionDataPayload } from '../../types/api/session_update_request';

type ResponseFeedbackResult = ReturnType<typeof updateSession> extends Promise<infer T> ? T : never;

type ResponseFeedbackVariables = {
  sessionId: string;
  payload: UpdateSessionDataPayload;
};

const useUpdateSession = (
  options?: Omit<UseMutationOptions<ResponseFeedbackResult, Error, ResponseFeedbackVariables>, 'mutationFn'>,
) => {
  const mutation = useMutation({
    mutationKey: ['update-session-data'],
    mutationFn: async ({ sessionId, payload }: { sessionId: string; payload: UpdateSessionDataPayload }) => {
      const response = await updateSession(sessionId, payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useUpdateSession;
