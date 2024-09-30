import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { postResponseFeedback } from "../../lib/http/api";
import { PostResponseFeedbackPayload } from "../../types/api";
import { ChatParams } from "../../types/msc";

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
  const { orgName = "" } = useParams<ChatParams>();

  const mutation = useMutation({
    mutationKey: ["post-response-feedback"],
    mutationFn: async ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: PostResponseFeedbackPayload;
    }) => {
      const response = await postResponseFeedback(sessionId, orgName, payload);

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useResponseFeedback;
