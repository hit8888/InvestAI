import { Configuration } from "@meaku/core/types/session";
import { hexToRGB } from "@meaku/core/utils/color";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getConfig } from "../../lib/http/api";
import ConfigResponseManager from "../../managers/ConfigResponseManager";
import { useMessageStore } from "../../stores/useMessageStore";
import { ChatParams } from "../../types/msc";
import { trackError } from "../../utils/error";
import useLocalStorageSession from "../useLocalStorageSession";

const useConfigData = () => {
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
        const manager = new ConfigResponseManager(config);
        const styleConfig = manager.getStyleConfig();
        const chatHistory = manager.getFormattedChatHistory();
        const suggestedQuestions = manager.getSuggestedQuestions();

        setMessages(chatHistory);
        setSuggestedQuestions(suggestedQuestions);

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
              component: "useConfigData",
            });
          }
        });
      } catch (err) {}

      return response.data;
    },
    enabled: !sessionData.sessionId,
  });

  return query;
};

export default useConfigData;
