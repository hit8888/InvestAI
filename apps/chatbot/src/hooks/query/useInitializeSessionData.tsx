import { Session } from "@meaku/core/types/session";
import { useQuery } from "@tanstack/react-query";
import Logrocket from "logrocket";
import { useParams } from "react-router-dom";
import { initializeSession } from "../../lib/http/api";
import UnifiedResponseManager from "../../managers/UnifiedResponseManager";
import { useChatStore } from "../../stores/useChatStore";
import { useMessageStore } from "../../stores/useMessageStore";
import { ChatParams } from "../../types/msc";
import { handleColorConfig } from "../../utils/common";
import { trackError } from "../../utils/error";
import { getBrowserSignature } from "../../utils/tracking";
import useUpdateProspect from "../mutation/useUpdateProspect";
import useAdminUserEmail from "../useAdminUserEmail";
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
  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);
  const setSuggestedQuestions = useMessageStore(
    (state) => state.setSuggestedQuestions,
  );
  const setHasFirstUserMessageBeenSent = useChatStore(
    (state) => state.setHasFirstUserMessageBeenSent,
  );

  const { isAdmin, isReadOnly } = useIsAdmin();
  const { userEmail, hasProspectBeenUpdated, setHasProspectBeenUpdated } =
    useAdminUserEmail();

  const { mutateAsync: handleUpdateProspect } = useUpdateProspect();

  const effectiveSessionId = sessionId || sessionDataInLocalStorage?.sessionId;
  const effectiveProspectId =
    prospectId || sessionDataInLocalStorage?.prospectId;

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
        session_id: effectiveSessionId,
        prospect_id: effectiveProspectId,
        browser_signature: getBrowserSignature(),
        is_admin: isAdmin,
      });

      const session = response.data as Session;

      try {
        const manager = new UnifiedResponseManager(session);

        const sessionId = manager.getSessionId() ?? "";
        const prospectId = manager.getProspectId() ?? "";
        const styleConfig = manager.getStyleConfig();
        const chatHistory = manager.getFormattedChatHistory({
          isAdmin,
          isReadOnly,
        });

        const suggestedQuestions = manager.getSuggestedQuestions();
        const hasFirstUserMessageBeenSent = chatHistory.some(
          (message) => message.role === "user",
        );

        if (messages.length <= 0) {
          setMessages(chatHistory);
          setSuggestedQuestions(suggestedQuestions);
          setHasFirstUserMessageBeenSent(hasFirstUserMessageBeenSent);
        }

        if (!ignoreUpdatingLocalStorage) {
          handleUpdateSessionData({
            sessionId: session.session_id,
            prospectId: session.prospect_id.toString(),
          });
        }

        handleColorConfig(styleConfig);

        if (isAdmin && !hasProspectBeenUpdated) {
          const data = await handleUpdateProspect({
            prospectId: session.prospect_id.toString(),
            payload: {
              email: userEmail,
            },
          });

          if (data) {
            setHasProspectBeenUpdated(true);
          }
        }

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
      Boolean(
        sessionDataInLocalStorage.sessionId || ignoreUpdatingLocalStorage,
      ),
  });

  return { session, isFetching, isError, error, isAdmin, ...query };
};

export default useInitializeSessionData;
