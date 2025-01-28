import { useEffect, useState } from "react";
import useAgentbotAnalytics from "./useAgentbotAnalytics";
import ANALYTICS_EVENT_NAMES from "@meaku/core/constants/analytics";
import { useSearchParams } from "react-router-dom";
import useLocalStorageSession from "./useLocalStorageSession";
import { useUrlParams } from "./useUrlParams";

interface IProps {
  fetchSessionData: () => void;
  handleOpenAgent: () => void;
  showBanner: boolean;
}

export const useEmbedAppEvents = ({
  fetchSessionData,
  handleOpenAgent,
  showBanner,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const { handleUpdateSessionData } = useLocalStorageSession();
  const { setParam } = useUrlParams();

  const [searchParams] = useSearchParams();

  const isAgentOpen = searchParams.get("isAgentOpen") === "true";

  const [shouldHideBottomBar, setHideBottomBar] = useState(false);

  useEffect(() => {
    const payload = {
      chatOpen: isAgentOpen,
      tooltipOpen: false,
      showBanner,
    };
    window.parent.postMessage(payload, "*");
  }, [isAgentOpen, showBanner]);

  useEffect(() => {
    const handleParentWindowMessages = (event: MessageEvent) => {
      const { type } = event.data;

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

        if (event.data.utmParams.is_test === "true") {
          setParam("is_test", "true");
        }

        if (event.data.utmParams.test_type === "automated") {
          setParam("test_type", "automated");
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

    return () => {
      window.removeEventListener("message", handleParentWindowMessages);
    };
  }, []);

  return { shouldHideBottomBar };
};
