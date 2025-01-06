import { useEffect, useState } from 'react';
import useAgentbotAnalytics from './useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useSearchParams } from 'react-router-dom';

interface IProps {
  fetchSessionData: () => void;
  handleOpenAgent: () => void;
}

export const useEmbedAppEvents = ({ fetchSessionData, handleOpenAgent }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const [searchParams] = useSearchParams();

  const isAgentOpen = searchParams.get('isAgentOpen') === 'true';

  const [shouldHideBottomBar, setHideBottomBar] = useState(false);

  useEffect(() => {
    const payload = {
      chatOpen: isAgentOpen,
      tooltipOpen: false,
    };
    window.parent.postMessage(payload, '*');
  }, [isAgentOpen]);

  useEffect(() => {
    const handleParentWindowMessages = (event: MessageEvent) => {
      const { type } = event.data;

      if (event.data.hideBottomBar) {
        setHideBottomBar(true);
      }

      if (type === 'open-breakout-button') {
        fetchSessionData();
        handleOpenAgent();
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.EXTERNAL_BUTTON_CLICKED, { ...event.data });
      }
    };
    window.addEventListener('message', handleParentWindowMessages);

    return () => {
      window.removeEventListener('message', handleParentWindowMessages);
    };
  }, []);

  return { shouldHideBottomBar };
};
