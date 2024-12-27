import { useEffect, useState } from 'react';
import useChatbotAnalytics from './useChatbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useSearchParams } from 'react-router-dom';

interface IProps {
  fetchSessionData: () => void;
  handleOpenChat: () => void;
}

export const useEmbedAppEvents = ({ fetchSessionData, handleOpenChat }: IProps) => {
  const { trackChatbotEvent } = useChatbotAnalytics();

  const [searchParams] = useSearchParams();

  const isChatOpen = searchParams.get('isChatOpen') === 'true';

  const [shouldHideBottomBar, setHideBottomBar] = useState(false);

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
    };
    window.parent.postMessage(payload, '*');
  }, [isChatOpen]);

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
