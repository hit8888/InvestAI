import { Session } from "@meaku/core/types/session";
import { hexToRGB } from "@meaku/core/utils/color";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { initializeSession } from "../../lib/http/api";
import InitializeSessionResponseManager from "../../managers/InitializeSessionResponseManager";
import { useMessageStore } from "../../stores/useMessageStore";
import { ChatParams } from "../../types/msc";
import { trackError } from "../../utils/error";
import { getBrowserSignature } from "../../utils/tracking";
import useIsAdmin from "../useIsAdmin";
import useLocalStorageSession from "../useLocalStorageSession";

interface UseInitializeSessionDataOptions {
  ignoreUpdatingLocalStorage?: boolean;
  sessionId?: string;
  prospectId?: string;
}

const useInitializeSessionData = (
  options: UseInitializeSessionDataOptions = {},
) => {
  const { ignoreUpdatingLocalStorage = false, sessionId, prospectId } = options;

  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const { sessionData: sessionDataInLocalStorage, handleUpdateSessionData } =
    useLocalStorageSession();
  const setMessages = useMessageStore((state) => state.setMessages);
  const setSuggestedQuestions = useMessageStore(
    (state) => state.setSuggestedQuestions,
  );

  const { isAdmin, isReadOnly } = useIsAdmin();
  const effectiveSessionId = sessionId || sessionDataInLocalStorage?.sessionId;
  const effectiveProspectId =
    prospectId || sessionDataInLocalStorage?.prospectId;

  const {
    data: session,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["session-initializer", effectiveSessionId, effectiveProspectId],
    queryFn: async () => {
      const response = await initializeSession(orgName, agentId, {
        session_id: effectiveSessionId,
        prospect_id: effectiveProspectId,
        browser_signature: getBrowserSignature(),
        is_admin: isAdmin,
      });

      const session = response.data as Session;

      try {
        const manager = new InitializeSessionResponseManager(session);

        const styleConfig = manager.getStyleConfig();
        const chatHistory = manager.getFormattedChatHistory({
          isAdmin,
          isReadOnly,
        });
        const suggestedQuestions = manager.getSuggestedQuestions();

        setMessages(chatHistory);
        setSuggestedQuestions(suggestedQuestions);

        if (!ignoreUpdatingLocalStorage) {
          handleUpdateSessionData({
            sessionId: session.session_id,
            prospectId: session.prospect_id.toString(),
          });
        }

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
    enabled: Boolean(orgName) && Boolean(agentId),
  });

  return { session, isFetching, isError, error, isAdmin };
};

export default useInitializeSessionData;
