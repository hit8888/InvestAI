import { type FC, type ReactNode, useCallback, useEffect, useMemo } from 'react';
import { nanoid } from 'nanoid';

import type { CommandBarSettings } from '@meaku/core/types/common';
import { getLocalStorageData, setLocalStorageData } from '@meaku/core/utils/storage-utils';
import useStaticConfigDataQuery from '@meaku/shared/network/http/queries/useStaticConfigDataQuery';
import { useCommandBarStore } from '@meaku/shared/stores';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useActiveTenantInit } from '../hooks/useActiveTenantInit';
import { ConfigurationApiResponse, sanitizeUrl } from '@meaku/core/index';
import useDynamicConfigDataQuery from '@meaku/shared/network/http/queries/useDynamicConfigDataQuery';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';
import useTracking from '../hooks/useTracking';
import { removeParamFromUrl } from '@meaku/core/utils/routing-utils';

interface PreloadContainerProps {
  children: ReactNode;
  settings: CommandBarSettings;
}

const PreloadContainer: FC<PreloadContainerProps> = ({ children, settings: initialSettings }) => {
  // Initialize active tenant context before any other operations
  useActiveTenantInit({
    tenantId: initialSettings.tenant_id,
    agentId: initialSettings.agent_id,
  });

  const { config, setConfig, setSettings, setCompleteConfigLoaded, setDynamicConfigLoading, setDynamicConfigStarted } =
    useCommandBarStore();
  const { trackEvent, updateCommonProperties } = useCommandBarAnalytics();
  const { dynamic_config_start_delay_ms = 5000 } = config.command_bar ?? {};

  const storageValues = useMemo(() => getLocalStorageData(), []);

  // Use config values first, because session api might have already created and set these values
  // If not available, use initialSettings values, and if not available, use storage values
  const currentProspectId = config.prospect_id ?? initialSettings.prospect_id ?? storageValues?.prospectId;
  const currentSessionId = config.session_id ?? initialSettings.session_id ?? storageValues?.sessionId;
  const currentDistinctId = storageValues?.distinctId;

  const dynamicConfigEnabled = useDelayedEnable(currentProspectId ? 0 : dynamic_config_start_delay_ms);

  const staticConfigQuery = useStaticConfigDataQuery(
    {
      agentId: initialSettings.agent_id,
    },
    {
      enabled: !currentProspectId,
    },
  );

  const dynamicConfigQuery = useDynamicConfigDataQuery(
    {
      agent_id: initialSettings.agent_id,
      parent_url: initialSettings.parent_url,
      session_id: currentSessionId,
      prospect_id: currentProspectId,
      nudge_disabled: false,
      browsed_urls: initialSettings.browsed_urls ?? [
        {
          url: sanitizeUrl(initialSettings.parent_url),
          timestamp: Date.now(),
        },
      ],
      query_params: initialSettings.query_params,
      is_test: initialSettings.is_test,
    },
    {
      enabled: dynamicConfigEnabled,
    },
  );

  const initialiseCommandBar = useCallback(
    (initialConfig: ConfigurationApiResponse = {} as ConfigurationApiResponse) => {
      const tenantName = initialConfig.org_name;
      const sessionId = initialConfig.session_id;
      const prospectId = initialConfig.prospect_id;

      setConfig({
        ...initialConfig,
        session_id: sessionId,
        prospect_id: prospectId,
      });
      updateCommonProperties({
        tenant_name: tenantName,
        session_id: sessionId,
        prospect_id: prospectId,
      });
      setLocalStorageData({ prospectId, sessionId });
    },
    [setConfig, updateCommonProperties],
  );

  useEffect(() => {
    let distinctId = currentDistinctId;

    if (!distinctId) {
      distinctId = nanoid();
      setLocalStorageData({ distinctId: distinctId });
    }

    updateCommonProperties({ distinct_id: distinctId });
  }, [currentDistinctId, updateCommonProperties]);

  // Initialise command bar after static config is available (prospect id does not exist)
  useEffect(() => {
    if (staticConfigQuery.data) {
      initialiseCommandBar(staticConfigQuery.data);
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.PAGE_LOAD);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticConfigQuery.data]);

  // Track when dynamic config query starts
  useEffect(() => {
    if (dynamicConfigEnabled && dynamicConfigQuery.isLoading) {
      setDynamicConfigStarted(true);
    }
  }, [dynamicConfigEnabled, dynamicConfigQuery.isLoading, setDynamicConfigStarted]);

  // Track dynamic config loading state
  useEffect(() => {
    setDynamicConfigLoading(dynamicConfigQuery.isLoading);
  }, [dynamicConfigQuery.isLoading, setDynamicConfigLoading]);

  // Initialise command bar after dynamic config is available (prospect id already exists)
  useEffect(() => {
    if (dynamicConfigQuery.data) {
      initialiseCommandBar(dynamicConfigQuery.data);
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.COMMAND_BAR_LOAD, {
        session_id: dynamicConfigQuery.data.session_id,
        prospect_id: dynamicConfigQuery.data.prospect_id,
      });
      removeParamFromUrl('session_id');
      removeParamFromUrl('prospect_id');
      setCompleteConfigLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicConfigQuery.data]);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings, setSettings]);

  useTracking();

  const enableCommandBar = initialSettings.enabled ?? config?.is_enabled;
  const shouldLoadApp = enableCommandBar && !!config.command_bar?.modules.length;

  if (shouldLoadApp) {
    return children;
  }

  return null;
};

export default PreloadContainer;
