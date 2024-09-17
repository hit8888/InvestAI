import { Message } from "@meaku/core/types/chat";
import { ChatConfig } from "@meaku/core/types/config";
import { SessionSchema } from "@meaku/core/types/session";
import { hexToRGB } from "@meaku/core/utils/color";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Embed from "../components/views/Embed";
import Widget from "../components/views/Widget";
import useLocalStorageSession from "../hooks/useLocalStorageSession";
import useWebSocketChat from "../hooks/useWebSocketChat";
import { initialize } from "../lib/http/api";
import { useChatStore } from "../stores/useChatStore";
import { useMessageStore } from "../stores/useMessageStore";

const componentsMap: Record<ChatConfig, React.ComponentType> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
};

type ChatParams = {
  orgName: string;
  agentId: string;
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

      const url = window.location.href;

      const response = await initialize(orgName, agentId, {
        url,
        session_id: sessionDataInLocalStorage?.sessionId,
        prospect_id: sessionDataInLocalStorage?.prospectId,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
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
      // TODO: Track error in sentry
      return;
    }

    setIsValidSession(true);

    const sessionData = validatedSession.data;

    const orgName = sessionData.configuration.org_name;
    const agentId = sessionData.agent_id.toString();

    const welcomeMessage =
      sessionData.configuration.body.welcome_message.message;
    const suggestedQuestions =
      sessionData.configuration.body.welcome_message.suggested_questions;

    const chatHistory = sessionData.configuration.body.chat_history;
    const formattedChatHistory: Message[] = chatHistory.map((message) => ({
      id: message.message_id,
      message: message.message,
      media: message.media,
      documents: message.documents,
      role: message.role,
    }));

    const styleConfig = sessionData.configuration.style_config;

    setOrgName(orgName);
    setAgentId(agentId);
    setSession(sessionData);
    setConfiguration(sessionData.configuration);

    setMessages(formattedChatHistory, welcomeMessage);
    setSuggestedQuestions(suggestedQuestions);

    Object.keys(styleConfig).forEach((key) => {
      const formattedKey = key.replace(/_/g, "-");
      const hexValue = styleConfig[key as keyof typeof styleConfig];

      if (!hexValue) return;

      try {
        const value = hexToRGB(hexValue);
        document.documentElement.style.setProperty(`--${formattedKey}`, value);
      } catch (error) {
        // TODO: Track error in sentry
      }

      handleUpdateSessionData({
        sessionId: sessionData.session_id,
        prospectId: sessionData.prospect_id.toString(),
      });
    });
  }, [session]);

  useEffect(() => {}, []);

  useEffect(() => {
    // TODO: Track error in sentry
    if (isError) {
      console.log(error);
    }
  }, [isError]);

  if (isFetching || isError || !isValidSession) return <></>;

  return <Component />;
};

export default Chat;
