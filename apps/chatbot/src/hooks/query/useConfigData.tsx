import { Configuration } from "@meaku/core/types/session";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getConfig } from "../../lib/http/api";
import UnifiedResponseManager from "../../managers/UnifiedResponseManager";
import { useMessageStore } from "../../stores/useMessageStore";
import { ChatParams } from "../../types/msc";
import { handleColorConfig } from "../../utils/common";
import useLocalStorageSession from "../useLocalStorageSession";

interface useConfigDataOptions {
  forceFetch?: boolean;
}

const useConfigData = (options: useConfigDataOptions = {}) => {
  const { forceFetch = false } = options;

  const { orgName = "", agentId = "" } = useParams<ChatParams>();
  const { sessionData } = useLocalStorageSession();

  const setMessages = useMessageStore((state) => state.setMessages);
  const setSuggestedQuestions = useMessageStore(
    (state) => state.setSuggestedQuestions,
  );

  const query = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const response = await getConfig(orgName, agentId);

      const config = response.data as Configuration;

      try {
        const manager = new UnifiedResponseManager(config);
        const styleConfig = manager.getStyleConfig();
        const chatHistory = manager.getFormattedChatHistory();
        const suggestedQuestions = manager.getSuggestedQuestions();

        setMessages(chatHistory);
        setSuggestedQuestions(suggestedQuestions);

        handleColorConfig(styleConfig);
      } catch (err) {}

      return response.data;
    },
    enabled: !sessionData.sessionId || forceFetch,
    staleTime: Infinity,
  });

  return query;
};

export default useConfigData;
