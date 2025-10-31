import './index.css';
import { useState, useEffect, useMemo } from 'react';

import { useWsClient } from '@meaku/shared/hooks/useWsClient';
import { setLocalStorageData, getLocalStorageData } from '@meaku/core/utils/storage-utils';
import { useCommandBarStore } from '@meaku/shared/stores';
import useSessionDataQuery from '@meaku/shared/network/http/queries/useSessionDataQuery';
import { useHistory } from '@meaku/core/hooks/useHistory';
import { sanitizeUrl } from '@meaku/core/utils/index';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { removeParamFromUrl } from '@meaku/core/utils/routing-utils';
import { CommandBarModuleType, CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { useUserLeftTracking } from './hooks/useUserLeftTracking';
import { useEntryAnimationTiming } from './hooks/useEntryAnimationTiming';
import { DEFAULT_ASK_AI_MODULE_ID, useFeature } from '@meaku/shared/containers/FeatureProvider';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';
import { CommandBarRenderer } from './components/BottomBar/CommandBarRenderer';
import { useBottomBarTransition, useCommandBarLayout } from './components/BottomBar/hooks';
import NudgeBanner from '@meaku/shared/features/nudge/NudgeBanner';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

function App() {
  const { trackEvent, updateCommonProperties } = useCommandBarAnalytics();
  const { activeFeature, setActiveFeature } = useFeature();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    setConfig,
    initMessages,
    settings,
    config,
    updateSettings,
    setSessionData,
    completeConfigLoaded,
    isDynamicConfigLoading,
    isDynamicConfigStarted,
  } = useCommandBarStore();
  const { modules = [], ui, nudge: nudgeConfig } = config.command_bar ?? {};

  const { initialiseSocket, sendUserMessage } = useWsClient();

  // Use layout hook for positioning logic
  const layout = useCommandBarLayout({
    position: ui?.position ?? 'bottom_right',
    settings,
    ui: ui ?? {},
  });

  // Use transition hook for bottom bar state management
  const { state: transitionState, actions: transitionActions } = useBottomBarTransition(
    setActiveFeature,
    sendUserMessage,
  );

  const totalAnimationDelay = useEntryAnimationTiming(modules) * 1000;
  const bottomBarEntryDelay = 700; // Bottom bar entry animation: 0.2s delay + 0.5s duration
  const nudgeDelay = layout.isBottomCenter ? bottomBarEntryDelay : totalAnimationDelay + 200;

  const nudgeEnabled = useDelayedEnable(nudgeDelay, {
    shouldStart: completeConfigLoaded && !!nudgeConfig,
  });

  // Use the query's enabled state to determine if API call has been initiated
  const { data: sessionData } = useSessionDataQuery(
    {
      command_bar_module_id: activeFeature?.id ?? DEFAULT_ASK_AI_MODULE_ID,
    },
    { enabled: !!activeFeature || !!config.session_id || !!settings.message },
  );

  // Initialize user left tracking
  useUserLeftTracking(sendUserMessage);

  const activeFeatureModuleType = activeFeature?.module_type ?? null;

  const handleNudgeBannerClick = (module: CommandBarModuleType) => {
    setActiveFeature(module);
  };

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
    updateCommonProperties({
      prospect_id: config.prospect_id,
      session_id: config.session_id,
      page_url: settings.parent_url,
    });
  }, [config.prospect_id, config.session_id, settings.parent_url, updateCommonProperties]);

  useEffect(() => {
    if (settings.message) {
      setActiveFeature(ASK_AI);
      sendUserMessage(settings.message, {
        command_bar_module_id: DEFAULT_ASK_AI_MODULE_ID,
      });
      updateSettings({ message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.message]);

  useHistory((currentUrl) => {
    if (sanitizeUrl(settings.parent_url) !== sanitizeUrl(currentUrl)) {
      updateSettings({ parent_url: currentUrl });
    }
  });

  // Only show initial tooltips for first-time visitors
  // Check localStorage for prospect_id (same logic as PreloadContainer for static vs dynamic API)
  const storageValues = useMemo(() => getLocalStorageData(), []);
  const isFirstTimeVisitor = !storageValues?.prospectId;

  return (
    <>
      <NudgeBanner activeFeature={activeFeatureModuleType} onClick={handleNudgeBannerClick} />
      <CommandBarRenderer
        layout={layout}
        transitionState={transitionState}
        transitionActions={transitionActions}
        activeFeatureModuleType={activeFeatureModuleType}
        setActiveFeature={setActiveFeature}
        nudgeEnabled={nudgeEnabled}
        isExpanded={isExpanded}
        onClose={handleClose}
        onExpand={() => setIsExpanded(!isExpanded)}
        isDynamicConfigLoading={isDynamicConfigLoading}
        isDynamicConfigStarted={isDynamicConfigStarted}
        isFirstTimeVisitor={isFirstTimeVisitor}
      />
    </>
  );
}

export default App;
