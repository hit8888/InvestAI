import { UpdateSessionDataPayloadSchema } from "@meaku/core/types/api";
import { trackError } from "../../../utils/error";
import { useEffect } from "react";
import { ChatParams } from "@meaku/core/types/index";
import { useParams } from "react-router-dom";
import useUnifiedConfigurationResponseManager from "./useUnifiedConfigurationResponseManager";
import useUpdateSession from "@meaku/core/queries/mutation/useUpdateSession";

const useUpdateSessionOnMount = () => {

    const { agentId = "" } = useParams<ChatParams>();

    const manager = useUnifiedConfigurationResponseManager()

    const sessionId = manager.getSessionId() ?? "";

    const { mutateAsync: handleMutateSession } = useUpdateSession({
        onError: (error) => {
            trackError(error, {
                action: "handleMutateSession",
                component: "Chat",
                sessionId,
            });
        },
    });

    useEffect(() => {
        const handleMessagePassing = async (event: MessageEvent) => {
            const type = event.data?.type;

            if (type !== "INIT") return;

            const payload = event.data.payload;

            const validatedPayload =
                UpdateSessionDataPayloadSchema.safeParse(payload);

            if (!validatedPayload.success) {
                trackError(validatedPayload.error, {
                    action: "handleMessagePassing | UpdateSessionDataPayloadSchema",
                    component: "Chat",
                });
                return;
            }

            try {
                window.top?.postMessage({ type: "CHAT_READY" }, "*");
            } catch (error) {
                trackError(error, {
                    action: "handleMessagePassing | postMessage",
                    component: "Chat",
                    sessionId,
                });
            }

            await handleMutateSession({ sessionId, agentId, payload: validatedPayload.data });
        };

        window.addEventListener("message", handleMessagePassing);

        return () => {
            window.removeEventListener("message", handleMessagePassing);
        };
    }, [agentId, handleMutateSession, sessionId]);
}


export { useUpdateSessionOnMount };