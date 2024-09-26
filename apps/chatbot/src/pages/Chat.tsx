import { Message } from "@meaku/core/types/chat";
import { ChatConfig } from "@meaku/core/types/config";
import { SessionSchema } from "@meaku/core/types/session";
import { hexToRGB } from "@meaku/core/utils/color";
import { useMutation, useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useLocalStorageSession from "../hooks/useLocalStorageSession";
import useWebSocketChat from "../hooks/useWebSocketChat";
import { initializeSession, updateSession } from "../lib/http/api";
import { useChatStore } from "../stores/useChatStore";
import { useMessageStore } from "../stores/useMessageStore";
import {
  UpdateSessionDataPayload,
  UpdateSessionDataPayloadSchema,
} from "../types/api";
import { ChatParams } from "../types/msc";
import { trackError } from "../utils/error";
import { getBrowserSignature } from "../utils/tracking";

const Widget = lazy(() => import("../components/views/Widget"));
const Embed = lazy(() => import("../components/views/Embed"));

const componentsMap: Record<ChatConfig, React.ComponentType> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
};

const Chat = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();
  const [searchParams] = useSearchParams();

  const { sessionData: sessionDataInLocalStorage, handleUpdateSessionData } =
    useLocalStorageSession({ orgName, agentId });

  const setOrgName = useChatStore((state) => state.setOrgName);
  const setAgentId = useChatStore((state) => state.setAgentId);
  const setSession = useChatStore((state) => state.setSession);
  const setConfiguration = useChatStore((state) => state.setConfiguration);

  const setMessages = useMessageStore((state) => state.setMessages);
  const setSuggestedQuestions = useMessageStore(
    (state) => state.setSuggestedQuestions,
  );

  const [isValidSession, setIsValidSession] = useState(false);

  const {
    data: session,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["session-initializer"],
    queryFn: async () => {
      if (!orgName || !agentId) return;

      const response = await initializeSession(orgName, agentId, {
        session_id: sessionDataInLocalStorage?.sessionId,
        prospect_id: sessionDataInLocalStorage?.prospectId,
        browser_signature: getBrowserSignature(),
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: handleMutateSession } = useMutation({
    mutationKey: ["update-session-data", session?.session_id],
    mutationFn: async ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: UpdateSessionDataPayload;
    }) => {
      const response = await updateSession(sessionId, agentId, payload);

      return response.data;
    },
    onError: (error) => {
      trackError(error, {
        action: "handleMutateSession",
        component: "Chat",
        sessionId: session?.session_id,
      });
    },
  });

  useWebSocketChat();

  const config =
    (searchParams.get("config")?.toLowerCase() as ChatConfig) ||
    ChatConfig.EMBED;

  const Component = componentsMap[config];

  useEffect(() => {
    if (!session) return;

    const validatedSession = SessionSchema.safeParse(session);

    if (!validatedSession.success) {
      trackError(validatedSession.error, {
        action: "useEffect | SessionSchema",
        component: "Chat",
      });
      return;
    }

    setIsValidSession(true);

    const sessionData = validatedSession.data;
    const sessionId = sessionData.session_id;

    const orgName = sessionData.configuration.org_name;
    const agentId = sessionData.agent_id.toString();

    const chatHistory = sessionData.configuration.body.chat_history;
    const formattedChatHistory: Message[] = chatHistory.map((message) => ({
      id: message.message_id,
      message: message.message,
      media: message.media,
      documents: message.documents,
      role: message.role,
      suggested_questions: message.suggested_questions,
    }));

    const suggestedQuestions =
      formattedChatHistory[formattedChatHistory.length - 1]
        .suggested_questions ?? [];

    const styleConfig = sessionData.configuration.style_config;

    setOrgName(orgName);
    setAgentId(agentId);
    setSession(sessionData);
    setConfiguration(sessionData.configuration);

    setSuggestedQuestions(suggestedQuestions);

    setMessages(formattedChatHistory);

    Object.keys(styleConfig).forEach((key) => {
      const formattedKey = key.replace(/_/g, "-");
      const hexValue = styleConfig[key as keyof typeof styleConfig];

      if (!hexValue) return;

      try {
        const value = hexToRGB(hexValue);
        document.documentElement.style.setProperty(`--${formattedKey}`, value);
      } catch (error) {
        trackError(error, {
          action: "useEffect | hexToRGB",
          component: "Chat",
        });
      }
    });

    handleUpdateSessionData({
      sessionId: sessionData.session_id,
      prospectId: sessionData.prospect_id.toString(),
    });

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
          sessionId: sessionData.session_id,
        });
      }

      await handleMutateSession({ sessionId, payload: validatedPayload.data });
    };

    window.addEventListener("message", handleMessagePassing);

    return () => {
      window.removeEventListener("message", handleMessagePassing);
    };
  }, [session]);

  useEffect(() => {
    if (isError) {
      trackError(error, {
        action: "initialization query error",
        component: "Chat",
      });
    }
  }, [isError, error]);

  if (isFetching || isError || !isValidSession) return <></>;

  return (
    <Suspense fallback={<></>}>
      <Component />
    </Suspense>
  );
};

export default Chat;
