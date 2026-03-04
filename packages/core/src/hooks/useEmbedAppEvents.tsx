import { useEffect, useState } from 'react';
import useAgentbotAnalytics from './useAgentbotAnalytics';
import { ENV } from '@neuraltrade/core/types/env';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import { useSearchParams } from 'react-router-dom';
import useLocalStorageSession from './useLocalStorageSession';
import { WebSocketMessage } from '../types/webSocketData';
import { useWidgetMode, WidgetMode } from '../contexts/WidgetModeProvider';
import { useAppEventsHook } from './useAppEventsHook';
import { EntryPointAlignmentType } from '../types/entryPoint';
import useConfigurationApiResponseManager from './useConfigurationApiResponseManager';

interface IProps {
  isAgentEnabled: boolean;
  fetchSessionData: () => void;
  handleOpenAgent: () => void;
  showBanner: boolean;
  cycleCompleted: boolean;
  hasFirstUserMessageBeenSent: boolean;
  entryPointAlignment: EntryPointAlignmentType;
  handleSendUserMessage: ({
    message,
    message_type,
  }: Pick<WebSocketMessage, 'message' | 'message_type'>) => Promise<void>;
}

export const useEmbedAppEvents = ({
  isAgentEnabled,
  fetchSessionData,
  handleOpenAgent,
  showBanner,
  cycleCompleted,
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

  const handleOpenAndShowAgent = () => {
    handleOpenAgent();
    setShouldShowAgent(true);
  };

  const handleEmbedAndOpenAgent = () => {
    setMode(WidgetMode.INLINE_EMBEDDED);
    handleOpenAndShowAgent();
  };

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
        setMode(WidgetMode.EMBEDDED_MODAL);
        handleOpenAndShowAgent();
        trackAgentbotEvent(ANALYTICS_EVENT_NAMES.PARENT_FORM_MESSAGE, {
          ...event.data.data,
        });
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
          handleEmbedAndOpenAgent();
        } else {
          setMode(WidgetMode.BOTTOM_BAR);
        }
        fetchSessionData();
        break;
      case 'open-breakout-button':
        fetchSessionData();
        handleOpenAndShowAgent();
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
              handleOpenAndShowAgent();
              trackAgentbotEvent(ANALYTICS_EVENT_NAMES.AGENT_OPENED_VIA_UTM_PARAMS, {
                ...payload,
              });
            }
          }
          if (payload?.prospectId) {
            handleUpdateSessionData({ prospectId: payload.prospectId });
          }
          if (typeof payload.isCollapsible === 'boolean') {
            setIsCollapsible(payload.isCollapsible);
            if (!payload.isCollapsible) {
              handleEmbedAndOpenAgent();
            }
          }
        }
        break;
      default:
        if (typeof newIsCollapsible === 'boolean') {
          setIsCollapsible(newIsCollapsible);
          if (!newIsCollapsible) {
            handleEmbedAndOpenAgent();
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
      isAgentEnabled,
      chatOpen: isAgentOpen,
      tooltipOpen: false,
      showBanner,
      cycleCompleted,
      hasFirstUserMessageBeenSent,
      entryPointAlignment,
    };
    window.parent.postMessage(payload, '*');
  }, [isAgentOpen, showBanner, hasFirstUserMessageBeenSent, entryPointAlignment, isAgentEnabled, cycleCompleted]);

  useEffect(() => {
    const apiBaseUrl = ENV.VITE_BASE_API_URL;
    window.parent.postMessage({ type: 'EMBED_READY', sessionId, prospectId, apiBaseUrl, config }, '*');
  }, []);

  return { shouldHideBottomBar, isCollapsible, mode, shouldShowAgent };
};
