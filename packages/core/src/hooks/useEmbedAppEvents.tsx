import { useEffect, useState } from "react";
import useAgentbotAnalytics from "./useAgentbotAnalytics";
import ANALYTICS_EVENT_NAMES from "@meaku/core/constants/analytics";
import { useSearchParams } from "react-router-dom";
import useLocalStorageSession from "./useLocalStorageSession";
import { IWebSocketHandleMessage } from "../types/webSocket";

interface IProps {
  fetchSessionData: () => void;
  handleOpenAgent: () => void;
  showBanner: boolean;
  hasFirstUserMessageBeenSent: boolean;
  handleSendUserMessage: ({
    message,
    eventType,
    eventData,
  }: IWebSocketHandleMessage) => Promise<void>;
}

type WidgetMode = "embed" | "overlay" | "bottomBar";

export const useEmbedAppEvents = ({
  fetchSessionData,
  handleOpenAgent,
  showBanner,
  hasFirstUserMessageBeenSent,
  handleSendUserMessage,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const { handleUpdateSessionData, sessionData: { sessionId} } = useLocalStorageSession();

  const [searchParams] = useSearchParams();
  const isAgentOpen = searchParams.get("isAgentOpen") === "true";

  const [shouldHideBottomBar, setHideBottomBar] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(true);
  const [mode, setMode] = useState<WidgetMode>("bottomBar");

  // Effect for sending chat state to parent
  useEffect(() => {
    const payload = {
      chatOpen: isAgentOpen,
      tooltipOpen: false,
      showBanner,
      hasFirstUserMessageBeenSent
    };
    window.parent.postMessage(payload, "*");
  }, [isAgentOpen, showBanner, hasFirstUserMessageBeenSent]);

  useEffect(() => {
    const handleParentWindowMessages = async (event: MessageEvent) => {
      const { type, isCollapsible: newIsCollapsible } = event.data;
      const updateMode = (newMode: WidgetMode) => {
        console.log(`Updating mode from ${mode} to ${newMode}`);
        setMode(newMode);
      };

      switch (type) {
        case "PARENT_FORM_MESSAGE":
          setIsCollapsible(true);
          updateMode("overlay");
          handleOpenAgent();
          if (event.data.data?.message) {
            fetchSessionData();
            handleSendUserMessage({ message: event.data.data.message });
          }
          break;

        case "MODE_CHANGE":
          if (event.data.isCollapsible === false) {
            updateMode("embed");
            handleOpenAgent();
          } else {
            updateMode("bottomBar");
          }
          fetchSessionData();
          break;

        default:
          // Handle isCollapsible changes for all other messages (including IFRAME_READY)
          if (typeof newIsCollapsible === "boolean") {
            setIsCollapsible(newIsCollapsible);
            if (!newIsCollapsible) {
              updateMode("embed");
              handleOpenAgent();
            }
          }
      }

      // Handle other message properties
      if (event.data.hideBottomBar) {
        setHideBottomBar(true);
      }

      if (event.data?.utmParams) {
        handleUpdateSessionData({ utmParams: event.data.utmParams });
        if (event.data.utmParams.isAgentOpen === "true") {
          fetchSessionData();
          handleOpenAgent();
          trackAgentbotEvent(
            ANALYTICS_EVENT_NAMES.AGENT_OPENED_VIA_UTM_PARAMS,
            {
              ...event.data,
            }
          );
        }
      }

      if (type === "open-breakout-button") {
        fetchSessionData();
        handleOpenAgent();
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.EXTERNAL_BUTTON_CLICKED, {
          ...event.data,
        });
      }
    };

    window.addEventListener("message", handleParentWindowMessages);

    // Send ready message to parent
    window.parent.postMessage({ type: "IFRAME_READY", sessionId: sessionId }, "*");

    return () => {
      window.removeEventListener("message", handleParentWindowMessages);
    };
  }, []);

  return { shouldHideBottomBar, isCollapsible, mode };
};
