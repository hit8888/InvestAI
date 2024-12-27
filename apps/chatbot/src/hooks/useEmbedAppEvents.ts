import { useEffect, useState } from 'react';
import useLocalStorageSession from './useLocalStorageSession';
import useChatbotAnalytics from './useChatbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  fetchSessionData: () => void;
  handleOpenChat: () => void;
}

export const useEmbedAppEvents = ({ fetchSessionData, handleOpenChat }: IProps) => {
  const { sessionData } = useLocalStorageSession();

  const { trackChatbotEvent } = useChatbotAnalytics();

  const isChatOpen = sessionData.isChatOpen;

  const showTooltip = !isChatOpen && (sessionData?.showTooltip ?? true);

  const [shouldHideBottomBar, setHideBottomBar] = useState(false);

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };
    window.parent.postMessage(payload, '*');
  }, [isChatOpen, showTooltip]);

  useEffect(() => {
    const handleParentWindowMessages = (event: MessageEvent) => {
      const { type } = event.data;

      if (event.data.hideBottomBar) {
        setHideBottomBar(true);
      }

      if (type === 'open-breakout-button') {
        fetchSessionData();
        handleOpenChat();
        trackChatbotEvent(ANALYTICS_EVENT_NAMES.EXTERNAL_BUTTON_CLICKED, { ...event.data });
      }
    };
    window.addEventListener('message', handleParentWindowMessages);

    return () => {
      window.removeEventListener('message', handleParentWindowMessages);
    };
  }, []);

  return { shouldHideBottomBar };
};
