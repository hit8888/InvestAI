import { ChatConfig } from "@meaku/core/types/config";
import { lazy, Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useUpdateSession from "@meaku/core/queries/mutation/useUpdateSession";
import useConfigDataQuery from "@meaku/core/queries/useConfigDataQuery"
import useWebSocketChat from "../../hooks/useWebSocketChat";
import UnifiedResponseManager from "../../../../../packages/core/src/managers/UnifiedSessionConfigResponseManager";
import { UpdateSessionDataPayloadSchema } from "@meaku/core/types/api";
import { trackError } from "../../utils/error";

const Widget = lazy(() => import("../../components/views/Widget"));
const Embed = lazy(() => import("../../components/views/Embed"));
const Multimedia = lazy(() => import("../../components/views/MultimediaChat"));

const componentsMap: Record<ChatConfig, React.ComponentType> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
  [ChatConfig.MULTIMEDIA]: Multimedia,
};

const Chat = () => {
  const [searchParams] = useSearchParams();

  useWebSocketChat();

  const { data: config, isError: isConfigFetchError } = useConfigDataQuery();
  const { session, isError: isInitializationError } =
    useInitializeSessionData();

  const manager = useMemo(() => {
    if (!session && !config) return;

    return new UnifiedResponseManager(session ?? config);
  }, [config, session]);

  const sessionId = manager?.getSessionId() ?? "";
  const isError = isConfigFetchError || isInitializationError;
  const renderUI = Boolean(config ?? session) && !isError;

  const { mutateAsync: handleMutateSession } = useUpdateSession({
    onError: (error) => {
      trackError(error, {
        action: "handleMutateSession",
        component: "Chat",
        sessionId: session?.session_id,
      });
    },
  });

  const chatConfig =
    (searchParams.get("config")?.toLowerCase() as ChatConfig) ||
    ChatConfig.EMBED;

  const Component = componentsMap[chatConfig];

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

      await handleMutateSession({ sessionId, payload: validatedPayload.data });
    };

    window.addEventListener("message", handleMessagePassing);

    return () => {
      window.removeEventListener("message", handleMessagePassing);
    };
  }, []);

  if (!renderUI) return <></>;

  return (
    <Suspense fallback={<></>}>
      <Component />
    </Suspense>
  );
};

export default Chat;
