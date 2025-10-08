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
import FeatureProvider from '@meaku/shared/containers/FeatureProvider';
import useDynamicConfigDataQuery from '@meaku/shared/network/http/queries/useDynamicConfigDataQuery';
import useDelayedEnable from '@meaku/core/hooks/useDelayedEnable';

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

  const dynamicConfigEnabled = useDelayedEnable(storageValues?.prospectId ? 0 : dynamic_config_start_delay_ms);

  const staticConfigQuery = useStaticConfigDataQuery(
    {
      agentId: initialSettings.agent_id,
    },
    {
      enabled: !storageValues?.prospectId,
    },
  );

  const dynamicConfigQuery = useDynamicConfigDataQuery(
    {
      agent_id: initialSettings.agent_id,
      parent_url: initialSettings.parent_url,
      session_id: storageValues?.sessionId,
      prospect_id: storageValues?.prospectId,
      nudge_disabled: false,
      browsed_urls: initialSettings.browsed_urls ?? [
        {
          url: sanitizeUrl(initialSettings.parent_url),
          timestamp: Date.now(),
        },
      ],
    },
    {
      enabled: dynamicConfigEnabled,
    },
  );

  const initialiseCommandBar = useCallback(
    (initialConfig: ConfigurationApiResponse = {} as ConfigurationApiResponse) => {
      const {
        distinctId,
        prospectId: storageProspectId,
        sessionId: storageSessionId,
        tenantName: storageTenantName,
      } = storageValues ?? {};
      const tenantName = initialConfig.org_name ?? storageTenantName;
      const sessionId = initialConfig.session_id ?? storageSessionId;
      const prospectId = initialConfig.prospect_id ?? storageProspectId;

      setConfig({
        ...initialConfig,
        session_id: sessionId,
        prospect_id: prospectId,
      });
      updateCommonProperties({
        tenant_name: tenantName,
        session_id: sessionId,
        prospect_id: prospectId,
        distinct_id: distinctId,
      });
      setLocalStorageData({ prospectId, sessionId, tenantName });
    },
    [setConfig, storageValues, updateCommonProperties],
  );

  useEffect(() => {
    const { prospectId } = storageValues ?? {};

    if (!prospectId) {
      setLocalStorageData({
        distinctId: nanoid(),
      });
    }
  }, [storageValues]);

  // Initialise command bar after static config is available (prospect id does not exist)
  useEffect(() => {
    if (staticConfigQuery.data) {
      initialiseCommandBar(staticConfigQuery.data);
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.PAGE_LOAD);
    }
  }, [initialiseCommandBar, staticConfigQuery.data, trackEvent]);

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
      setCompleteConfigLoaded(true);
    }
  }, [dynamicConfigQuery.data, initialiseCommandBar, setCompleteConfigLoaded, trackEvent]);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings, setSettings]);

  const shouldLoadApp = config?.is_enabled && !!config.command_bar?.modules.length;

  if (shouldLoadApp) {
    return <FeatureProvider features={config.command_bar?.modules ?? []}>{children}</FeatureProvider>;
  }

  return null;
};

export default PreloadContainer;
