import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { updateSession } from "../../../../../packages/core/src/http/api";
import { UpdateSessionDataPayload } from "@meaku/core/types/api";
import { ChatParams } from "@meaku/core/types/msc";

type ResponseFeedbackResult =
  ReturnType<typeof updateSession> extends Promise<infer T> ? T : never;

type ResponseFeedbackVariables = {
  sessionId: string;
  payload: UpdateSessionDataPayload;
};

const useUpdateSession = (
  options?: Omit<
    UseMutationOptions<
      ResponseFeedbackResult,
      Error,
      ResponseFeedbackVariables
    >,
    "mutationFn"
  >,
) => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const mutation = useMutation({
    mutationKey: ["update-session-data"],
    mutationFn: async ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: UpdateSessionDataPayload;
    }) => {
      const response = await updateSession(
        sessionId,
        agentId,
        orgName,
        payload,
      );

      return response.data;
    },
    ...options,
  });

  return mutation;
};

export default useUpdateSession;
