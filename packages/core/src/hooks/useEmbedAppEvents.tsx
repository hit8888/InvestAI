import { useEffect, useState } from 'react';
import useAgentbotAnalytics from './useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useSearchParams } from 'react-router-dom';
import useLocalStorageSession from './useLocalStorageSession';
import { WebSocketMessage } from '../types/webSocketData';
import { useWidgetMode } from '../contexts/WidgetModeProvider';

interface IProps {
  fetchSessionData: () => void;
  handleOpenAgent: () => void;
  showBanner: boolean;
  hasFirstUserMessageBeenSent: boolean;
  handleSendUserMessage: ({
    message,
    message_type,
  }: Pick<WebSocketMessage, 'message' | 'message_type'>) => Promise<void>;
}

export const useEmbedAppEvents = ({
  fetchSessionData,
  handleOpenAgent,
  showBanner,
  hasFirstUserMessageBeenSent,
  handleSendUserMessage,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const {
    handleUpdateSessionData,
    sessionData: { sessionId },
  } = useLocalStorageSession();

  const { mode, setMode } = useWidgetMode();
  const [shouldHideBottomBar, setHideBottomBar] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(true);

  const [searchParams] = useSearchParams();
  const isAgentOpen = searchParams.get('isAgentOpen') === 'true';

  // Effect for sending chat state to parent
  useEffect(() => {
    const payload = {
      chatOpen: isAgentOpen,
      tooltipOpen: false,
      showBanner,
      hasFirstUserMessageBeenSent,
    };
    window.parent.postMessage(payload, '*');
  }, [isAgentOpen, showBanner, hasFirstUserMessageBeenSent]);

  useEffect(() => {
    const handleParentWindowMessages = async (event: MessageEvent) => {
      const { type, isCollapsible: newIsCollapsible } = event.data;

      switch (type) {
        case 'PARENT_FORM_MESSAGE':
          setIsCollapsible(true);
          setMode('overlay');
          handleOpenAgent();
          if (event.data.data?.message) {
            fetchSessionData();
            handleSendUserMessage({
              message: { content: event.data.data.message },
              message_type: 'TEXT',
            });
          }
          break;
        case 'MODE_CHANGE':
          if (event.data.isCollapsible === false) {
            setMode('embed');
            handleOpenAgent();
          } else {
            setMode('bottomBar');
          }
          fetchSessionData();
          break;

        default:
          if (typeof newIsCollapsible === 'boolean') {
            setIsCollapsible(newIsCollapsible);
            if (!newIsCollapsible) {
              setMode('embed');
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
        if (event.data.utmParams.isAgentOpen === 'true') {
          fetchSessionData();
          handleOpenAgent();
          trackAgentbotEvent(ANALYTICS_EVENT_NAMES.AGENT_OPENED_VIA_UTM_PARAMS, {
            ...event.data,
          });
        }
      }

      if (type === 'open-breakout-button') {
        fetchSessionData();
        handleOpenAgent();
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.EXTERNAL_BUTTON_CLICKED, {
          ...event.data,
        });
      }
    };

    window.addEventListener('message', handleParentWindowMessages);

    // Send ready message to parent
    window.parent.postMessage({ type: 'IFRAME_READY', sessionId: sessionId }, '*');

    return () => {
      window.removeEventListener('message', handleParentWindowMessages);
    };
  }, []);

  return { shouldHideBottomBar, isCollapsible, mode };
};
