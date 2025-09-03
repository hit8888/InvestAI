import './index.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@meaku/saral';
import CommandBarActions from './components/CommandBarActions';
import FeatureContentContainer from './components/FeatureContentContainer';
import type { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { useWsClient } from '@meaku/shared/hooks/useWsClient';
import { setLocalStorageData } from '@meaku/core/utils/storage-utils';
import { useCommandBarStore } from '@meaku/shared/stores';
import { Nudge } from '@meaku/shared/features';
import useSessionDataQuery from '@meaku/shared/network/http/queries/useSessionDataQuery';
import useDynamicConfigDataQuery from '@meaku/shared/network/http/queries/useDynamicConfigDataQuery';
import { useHistory } from '@meaku/core/hooks/useHistory';
import { sanitizeUrl } from '@meaku/core/utils/index';
import { initProspectAnalytics } from '@meaku/core/lib/prospectAnalytics/index';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import useUpdateProspectMutation from '@meaku/shared/network/http/mutations/useUpdateProspectMutation';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { removeParamFromUrl } from '@meaku/core/utils/routing-utils';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

function App() {
  const { trackEvent, updateCommonProperties } = useCommandBarAnalytics();
  const [activeFeature, setActiveFeature] = useState<CommandBarModuleType | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { setConfig, initMessages, settings, config, updateSettings, setSessionData } = useCommandBarStore();
  const { modules = [], ui, nudge: nudgeConfig } = config.command_bar ?? {};
  const { position = 'bottom_right' } = ui ?? {};

  const dynamicConfigQuery = useDynamicConfigDataQuery({ nudge_disabled: !!activeFeature });
  const { data: sessionData } = useSessionDataQuery(
    {},
    { enabled: !!activeFeature || !!config.session_id || !!settings.message },
  );

  const updateProspectMutation = useUpdateProspectMutation();

  const { initialiseSocket, sendUserMessage } = useWsClient();

  const handleSetActiveButton = (button: CommandBarModuleType | null) => {
    if (!button) {
      setActiveFeature(null);
      return;
    }

    const moduleSupported = modules.find((m) => m.module_type === button);

    if (moduleSupported) {
      setActiveFeature(button);
    } else {
      setActiveFeature(ASK_AI);
    }
  };

  const handleClose = () => {
    setActiveFeature(null);
    setIsExpanded(false);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.CLOSE_COMMAND_BAR, {
      action_type: activeFeature,
    });
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
      setSessionData(sessionData);
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
      const tenantName = dynamicConfigQuery.data.org_name;

      setLocalStorageData({ prospectId, sessionId, tenantName });
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

  useEffect(() => {
    if (settings.message) {
      sendUserMessage(settings.message);
      setActiveFeature(ASK_AI);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.message]);

  const containerClasses = cn(
    'fixed z-[2147483646]',
    position === 'bottom_left' ? 'left-4 bottom-4' : 'right-4 bottom-4',
  );

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div key="root-content" className="flex items-end gap-4">
        {dynamicConfigQuery?.isFetched && nudgeConfig && (
          <Nudge activeFeature={activeFeature} setActiveFeature={handleSetActiveButton} />
        )}
        <CommandBarActions activeFeature={activeFeature} setActiveFeature={handleSetActiveButton} />
        <FeatureContentContainer
          activeFeature={activeFeature}
          setActiveFeature={handleSetActiveButton}
          isExpanded={isExpanded}
          onClose={handleClose}
          onExpand={() => setIsExpanded(!isExpanded)}
        />
      </div>
    </motion.div>
  );
}

export default App;
