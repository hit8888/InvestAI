import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { postResponseFeedback } from "../../http/api";
import { PostResponseFeedbackPayload } from "../../types/api";


type ResponseFeedbackResult =
  ReturnType<typeof postResponseFeedback> extends Promise<infer T> ? T : never;

type ResponseFeedbackVariables = {
  sessionId: string;
  payload: PostResponseFeedbackPayload;
};

const useResponseFeedback = (
  options?: Omit<
    UseMutationOptions<
      ResponseFeedbackResult,
      Error,
      ResponseFeedbackVariables
    >,
    "mutationFn"
  >,
) => {

  const mutation = useMutation({
    mutationKey: ["post-response-feedback"],
    mutationFn: async ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: PostResponseFeedbackPayload;
    }) => {
      const response = await postResponseFeedback(sessionId, payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useResponseFeedback;
