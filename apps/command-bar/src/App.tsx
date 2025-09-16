import './index.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@meaku/saral';
import CommandBarActions from './components/CommandBarActions';
import FeatureContentContainer from './components/FeatureContentContainer';
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
import { useUserLeftTracking } from './hooks/useUserLeftTracking';
import { useEntryAnimationTiming } from './hooks/useEntryAnimationTiming';
import { COMPONENT_TRANSITIONS } from './constants/animationTimings';
import { DEFAULT_ASK_AI_MODULE_ID, useFeature } from '@meaku/shared/containers/FeatureProvider';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

function App() {
  const { trackEvent, updateCommonProperties } = useCommandBarAnalytics();
  const { activeFeature, setActiveFeature } = useFeature();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldStartAnimations, setShouldStartAnimations] = useState(false);

  const { setConfig, initMessages, settings, config, updateSettings, setSessionData } = useCommandBarStore();
  const { modules = [], ui, nudge: nudgeConfig } = config.command_bar ?? {};
  const { position = 'bottom_right' } = ui ?? {};

  const totalAnimationDelay = useEntryAnimationTiming(modules) * 1000;

  const dynamicConfigQuery = useDynamicConfigDataQuery({ nudge_disabled: !!activeFeature });
  const { data: sessionData } = useSessionDataQuery(
    {
      command_bar_module_id: activeFeature?.id ?? DEFAULT_ASK_AI_MODULE_ID,
    },
    { enabled: !!activeFeature || !!config.session_id || !!settings.message },
  );

  const updateProspectMutation = useUpdateProspectMutation();

  const { initialiseSocket, sendUserMessage } = useWsClient();

  const nudgeEnabled = useDelayedEnable(totalAnimationDelay + 200, {
    shouldStart: dynamicConfigQuery?.isFetched && !!nudgeConfig,
  });

  // Initialize user left tracking
  useUserLeftTracking(sendUserMessage);

  const activeFeatureModuleType = activeFeature?.module_type ?? null;

  const handleClose = () => {
    setActiveFeature(null);
    setIsExpanded(false);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.CLOSE_COMMAND_BAR, {
      action_type: activeFeatureModuleType,
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

      // Start animations after dynamic config is loaded
      setShouldStartAnimations(true);
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
      setActiveFeature(ASK_AI);
      sendUserMessage(settings.message, {
        command_bar_module_id: DEFAULT_ASK_AI_MODULE_ID,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.message]);

  const containerClasses = cn(
    'fixed z-command-bar',
    position === 'bottom_left' ? 'left-4 bottom-4' : 'right-4 bottom-4',
  );

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={COMPONENT_TRANSITIONS.APP_CONTAINER}
    >
      <div key="root-content" className="flex items-end gap-4">
        {nudgeEnabled && <Nudge activeFeature={activeFeatureModuleType} setActiveFeature={setActiveFeature} />}
        <CommandBarActions
          activeFeature={activeFeatureModuleType}
          setActiveFeature={setActiveFeature}
          shouldStartAnimations={shouldStartAnimations}
        />
        <FeatureContentContainer
          key={activeFeatureModuleType}
          activeFeature={activeFeatureModuleType}
          setActiveFeature={setActiveFeature}
          isExpanded={isExpanded}
          onClose={handleClose}
          onExpand={() => setIsExpanded(!isExpanded)}
        />
      </div>
    </motion.div>
  );
}

export default App;
