import { useEffect, useState } from 'react';
import useAgentbotAnalytics from './useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useSearchParams } from 'react-router-dom';
import useLocalStorageSession from './useLocalStorageSession';
import { WebSocketMessage } from '../types/webSocketData';
import { useWidgetMode } from '../contexts/WidgetModeProvider';
import { useAppEventsHook } from './useAppEventsHook';

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
  const { handleUpdateSessionData } = useLocalStorageSession();

  const { mode, setMode } = useWidgetMode();
  const [shouldHideBottomBar, setHideBottomBar] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(true);

  const [searchParams] = useSearchParams();
  const isAgentOpen = searchParams.get('isAgentOpen') === 'true';

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
        if (!event.data.isCollapsible) {
          setMode('embed');
          handleOpenAgent();
        } else {
          setMode('bottomBar');
        }
        fetchSessionData();
        break;
      case 'open-breakout-button':
        fetchSessionData();
        handleOpenAgent();
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.EXTERNAL_BUTTON_CLICKED, {
          ...event.data,
        });
        break;
      case 'INIT':
        {
          const { payload } = event.data;
          if (payload.hideBottomBar) {
            setHideBottomBar(true);
          }
          if (payload?.utmParams) {
            handleUpdateSessionData({ utmParams: payload.utmParams });
            if (payload.utmParams.isAgentOpen === 'true') {
              fetchSessionData();
              handleOpenAgent();
              trackAgentbotEvent(ANALYTICS_EVENT_NAMES.AGENT_OPENED_VIA_UTM_PARAMS, {
                ...event.data,
              });
            }
          }
          if (payload.isCollapsible) {
            if (typeof payload.isCollapsible === 'boolean') {
              setIsCollapsible(payload.isCollapsible);
              if (!payload.isCollapsible) {
                setMode('embed');
                handleOpenAgent();
              }
            }
          }
        }
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
  };

  useAppEventsHook(handleParentWindowMessages);

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

  return { shouldHideBottomBar, isCollapsible, mode };
};
