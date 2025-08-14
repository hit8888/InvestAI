import './index.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@meaku/saral';
import CommandBarActions from './components/CommandBarActions';
import FeatureContentContainer from './components/FeatureContentContainer';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { useChat } from './hooks/useChat';
import { setLocalStorageData } from '@meaku/core/utils/storage-utils';
import { useCommandBarStore } from './stores';
import { Nudge } from '@meaku/shared/features';
import useSessionDataQuery from '@meaku/shared/network/http/queries/useSessionDataQuery';
import useDynamicConfigDataQuery from '@meaku/shared/network/http/queries/useDynamicConfigDataQuery';
import useDelayedQuery from '@meaku/core/hooks/useDelayedQuery';
import { useHistory } from '@meaku/core/hooks/useHistory';
import { sanitizeUrl } from '@meaku/core/utils/index';
import { initProspectAnalytics } from '@meaku/core/lib/prospectAnalytics/index';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import { useStyleConfig } from './hooks/useStyleConfig';
import useUpdateProspectMutation from '@meaku/shared/network/http/mutations/useUpdateProspectMutation';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { removeParamFromUrl } from '@meaku/core/utils/routing-utils';

function App() {
  const { trackEvent, updateCommonProperties } = useCommandBarAnalytics();
  const [activeButton, setActiveButton] = useState<CommandBarModuleType | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { setConfig, isLoading, messages, initMessages, settings, config, updateSettings } = useCommandBarStore();
  const containerRef = useStyleConfig({ styleConfig: config?.style_config });
  const { modules = [], ui, dynamic_config_start_delay_ms = 5000 } = config.command_bar ?? {};
  const { position = 'bottom_right' } = ui ?? {};

  const dynamicConfigEnabled = useDelayedQuery(dynamic_config_start_delay_ms);
  const dynamicConfigQuery = useDynamicConfigDataQuery(
    {
      agentId: settings.agent_id,
      parent_url: settings.parent_url,
      session_id: config.session_id,
      prospect_id: config.prospect_id,
      nudge_disabled: !!activeButton,
      browsed_urls: settings.browsed_urls ?? [
        {
          url: sanitizeUrl(settings.parent_url),
          timestamp: Date.now(),
        },
      ],
    },
    {
      enabled: dynamicConfigEnabled,
    },
  );
  const { data: sessionData, isLoading: isSessionDataLoading } = useSessionDataQuery(
    {
      agentId: settings.agent_id,
      session_id: settings.session_id ?? config.session_id,
      prospect_id: config.prospect_id,
    },
    {
      enabled: !!activeButton || !!config.session_id,
    },
  );

  const updateProspectMutation = useUpdateProspectMutation();

  const { sendUserMessage, initialiseSocket } = useChat();

  const handleSetActiveButton = (button: CommandBarModuleType | null) => {
    if (!button) {
      setActiveButton(null);
      return;
    }

    const moduleSupported = modules.find((m) => m.module_type === button);

    if (moduleSupported) {
      setActiveButton(button);
    } else {
      setActiveButton('ASK_AI');
    }
  };

  const handleClose = () => {
    setActiveButton(null);
    setIsExpanded(false);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.CLOSE_COMMAND_BAR, {
      action_type: activeButton,
    });
  };

  const getActiveModule = () => {
    if (!activeButton) return null;
    const action = modules.find((a) => a.module_type === activeButton);
    return action ?? null;
  };

  useEffect(() => {
    if (sessionData) {
      const prospectId = sessionData.prospect_id ?? config.prospect_id;
      const sessionId = sessionData.session_id ?? config.session_id;

      setLocalStorageData({ prospectId, sessionId });
      setConfig({
        ...config,
        session_id: sessionId,
        prospect_id: prospectId,
      });
      initMessages(sessionData.chat_history);
      initialiseSocket(sessionId, settings.tenant_id);
      removeParamFromUrl('session_id');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData]);

  useEffect(() => {
    if (dynamicConfigQuery.data) {
      const prospectId = dynamicConfigQuery.data.prospect_id ?? config.prospect_id;
      const sessionId = dynamicConfigQuery.data.session_id ?? config.session_id;

      setLocalStorageData({ prospectId, sessionId });
      setConfig(dynamicConfigQuery.data);
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.COMMAND_BAR_LOAD, {
        session_id: sessionId,
        prospect_id: prospectId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicConfigQuery.data]);

  useEffect(() => {
    updateCommonProperties({
      prospect_id: config.prospect_id,
      session_id: config.session_id,
      page_url: settings.parent_url,
    });
  }, [config.prospect_id, config.session_id, settings.parent_url, updateCommonProperties]);

  useEffect(() => {
    if (!config.tracking_config) {
      return;
    }

    const cleanup = initProspectAnalytics(config.tracking_config, (requestData) => {
      if (!config.prospect_id) {
        return;
      }

      updateProspectMutation.mutate({
        prospectId: config.prospect_id,
        payload: requestData,
      });
    });

    return () => {
      cleanup();
    };
  }, [config.tracking_config, config.prospect_id, updateProspectMutation]);

  useHistory((currentUrl) => {
    if (sanitizeUrl(settings.parent_url) !== sanitizeUrl(currentUrl)) {
      updateSettings({ parent_url: currentUrl });
    }
  });

  const containerClasses = cn('fixed', position === 'bottom_left' ? 'left-4 bottom-4' : 'right-4 bottom-4');

  return (
    <motion.div
      ref={containerRef}
      className={containerClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div key="root-content" className="flex items-end gap-4">
        {dynamicConfigQuery?.isFetched && (
          <Nudge
            settings={settings}
            config={config}
            activeFeature={activeButton}
            setActiveFeature={handleSetActiveButton}
            sendUserMessage={sendUserMessage}
          />
        )}
        <FeatureContentContainer
          settings={settings}
          position={position}
          module={getActiveModule()}
          onClose={handleClose}
          onExpand={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
          config={config}
          messages={messages}
          isInitialising={isSessionDataLoading}
          isLoading={isLoading}
          sendUserMessage={sendUserMessage}
        />

        {/* Right side - button container */}
        <CommandBarActions
          messages={messages}
          sendUserMessage={sendUserMessage}
          actions={modules}
          activeButton={activeButton}
          onActiveButtonChange={handleSetActiveButton}
          orgConfig={config.style_config.orb_config}
        />
      </div>
    </motion.div>
  );
}

export default App;
