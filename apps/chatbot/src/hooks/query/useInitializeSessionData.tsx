import { Session } from "@meaku/core/types/session";
import { hexToRGB } from "@meaku/core/utils/color";
import { useQuery } from "@tanstack/react-query";
import Logrocket from "logrocket";
import { useParams } from "react-router-dom";
import { initializeSession } from "../../lib/http/api";
import InitializeSessionResponseManager from "../../managers/InitializeSessionResponseManager";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";
import { ChatParams } from "../../types/msc";
import { trackError } from "../../utils/error";
import { getBrowserSignature } from "../../utils/tracking";
import useIsAdmin from "../useIsAdmin";
import useLocalStorageSession from "../useLocalStorageSession";

const useInitializeSessionData = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const { sessionData: sessionDataInLocalStorage, handleUpdateSessionData } =
    useLocalStorageSession();
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const setSuggestedQuestions = useMessageStore(
    (state) => state.setSuggestedQuestions,
  );
  const setHasFirstUserMessageBeenSent = useChatStore(
    (state) => state.setHasFirstUserMessageBeenSent,
  );

  const isAdmin = useIsAdmin();

  const {
    data: session,
    isFetching,
    isError,
    error,
    ...query
  } = useQuery({
    queryKey: ["session-initializer"],
    queryFn: async () => {
      const response = await initializeSession(orgName, agentId, {
        session_id: sessionDataInLocalStorage?.sessionId,
        prospect_id: sessionDataInLocalStorage?.prospectId,
        browser_signature: getBrowserSignature(),
        is_admin: isAdmin,
      });

      const session = response.data as Session;

      try {
        const manager = new InitializeSessionResponseManager(session);

        const sessionId = manager.getSessionId();
        const prospectId = manager.getProspectId();
        const styleConfig = manager.getStyleConfig();
        const suggestedQuestions = manager.getSuggestedQuestions();
        const chatHistory = manager.getFormattedChatHistory(isAdmin);
        const hasFirstUserMessageBeenSent = chatHistory.some(
          (message) => message.role === "user",
        );

        if (messages.length <= 0) {
          setMessages(chatHistory);
          setSuggestedQuestions(suggestedQuestions);
        }

        setHasFirstUserMessageBeenSent(hasFirstUserMessageBeenSent);

        handleUpdateSessionData({
          sessionId: session.session_id,
          prospectId: session.prospect_id.toString(),
        });

        Object.keys(styleConfig).forEach((key) => {
          const formattedKey = key.replace(/_/g, "-");
          const hexValue = styleConfig[key as keyof typeof styleConfig];

          if (!hexValue) return;

          try {
            const value = hexToRGB(hexValue);
            document.documentElement.style.setProperty(
              `--${formattedKey}`,
              value,
            );
          } catch (error) {
            trackError(error, {
              action: "useEffect | hexToRGB",
              component: "Chat",
            });
          }
        });

        Logrocket.identify(prospectId, {
          sessionId,
        });

        return session;
      } catch (error) {
        trackError(error, {
          action: "useInitializeSessionData | InitializeSessionResponseManager",
          component: "Chat",
        });

        return null;
      }
    },
    staleTime: Infinity,
    enabled:
      Boolean(orgName) &&
      Boolean(agentId) &&
      Boolean(sessionDataInLocalStorage.sessionId),
  });

  return { session, isFetching, isError, error, isAdmin, ...query };
};

export default useInitializeSessionData;
