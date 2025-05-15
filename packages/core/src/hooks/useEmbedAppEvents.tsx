import { useEffect, useState } from 'react';
import useAgentbotAnalytics from './useAgentbotAnalytics';
import { ENV } from '@meaku/core/types/env';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useSearchParams } from 'react-router-dom';
import useLocalStorageSession from './useLocalStorageSession';
import { WebSocketMessage } from '../types/webSocketData';
import { useWidgetMode } from '../contexts/WidgetModeProvider';
import { useAppEventsHook } from './useAppEventsHook';
import { EntryPointAlignmentType } from '../types/entryPoint';
import useConfigurationApiResponseManager from './useConfigurationApiResponseManager';

interface IProps {
  fetchSessionData: () => void;
  handleOpenAgent: () => void;
  showBanner: boolean;
  hasFirstUserMessageBeenSent: boolean;
  entryPointAlignment: EntryPointAlignmentType;
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
  entryPointAlignment,
  handleSendUserMessage,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const { handleUpdateSessionData } = useLocalStorageSession();
  const {
    sessionData: { sessionId, prospectId },
  } = useLocalStorageSession();

  const { mode, setMode } = useWidgetMode();
  const [shouldHideBottomBar, setHideBottomBar] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(true);
  const [shouldShowAgent, setShouldShowAgent] = useState(false);

  const [searchParams] = useSearchParams();
  const isAgentOpen = searchParams.get('isAgentOpen') === 'true';

  const handleParentWindowMessages = async (event: MessageEvent) => {
    const { type, isCollapsible: newIsCollapsible } = event.data;

    if (event.data.chatOpen === true) {
      setShouldShowAgent(true);
    } else if (event.data.chatOpen === false) {
      setShouldShowAgent(false);
    }
    switch (type) {
      case 'PARENT_FORM_MESSAGE':
        setIsCollapsible(true);
        setMode('overlay');
        handleOpenAgent();
        if (event.data.data?.message) {
          if (event.data?.prospectId) {
            handleUpdateSessionData({ prospectId: event.data.prospectId });
          }

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
              handleOpenAgent();
              trackAgentbotEvent(ANALYTICS_EVENT_NAMES.AGENT_OPENED_VIA_UTM_PARAMS, {
                ...event.data,
              });
            }
          }
          if (payload?.prospectId) {
            handleUpdateSessionData({ prospectId: payload.prospectId });
          }
          if (typeof payload.isCollapsible === 'boolean') {
            setIsCollapsible(payload.isCollapsible);
            if (!payload.isCollapsible) {
              setMode('embed');
              handleOpenAgent();
              setShouldShowAgent(true);
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

  const manager = useConfigurationApiResponseManager();
  const config = manager.getConfig();

  // Effect for sending chat state to parent
  useEffect(() => {
    const payload = {
      chatOpen: isAgentOpen,
      tooltipOpen: false,
      showBanner,
      hasFirstUserMessageBeenSent,
      entryPointAlignment,
    };
    window.parent.postMessage(payload, '*');
  }, [isAgentOpen, showBanner, hasFirstUserMessageBeenSent, entryPointAlignment]);

  useEffect(() => {
    const apiBaseUrl = ENV.VITE_BASE_API_URL;
    window.parent.postMessage({ type: 'EMBED_READY', sessionId, prospectId, apiBaseUrl, config }, '*');
  }, []);

  return { shouldHideBottomBar, isCollapsible, mode, shouldShowAgent };
};
