import { type FC, type ReactNode, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';

import type { CommandBarSettings } from '@meaku/core/types/common';
import { getLocalStorageData, setLocalStorageData, setActiveTenantData } from '@meaku/core/utils/storage-utils';
import { setTenantHeader } from '@meaku/core/http/client';
import useStaticConfigDataQuery from '@meaku/shared/network/http/queries/useStaticConfigDataQuery';
import { useCommandBarStore } from '@meaku/shared/stores';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useStyleConfig from '../hooks/useStyleConfig';
import useBrandCoverImage from '../hooks/useBrandCoverImage';
import { ConfigurationApiResponse } from '@meaku/core/index';

interface PreloadContainerProps {
  children: ReactNode;
  settings: CommandBarSettings;
}

const PreloadContainer: FC<PreloadContainerProps> = ({ children, settings: initialSettings }) => {
  const { config, setConfig, setSettings } = useCommandBarStore();
  const { trackEvent, updateCommonProperties } = useCommandBarAnalytics();

  useEffect(() => {
    if (initialSettings.tenant_id && initialSettings.agent_id) {
      setTenantHeader(initialSettings.tenant_id);
      setActiveTenantData(initialSettings.tenant_id, initialSettings.agent_id);
    }
  }, [initialSettings.tenant_id, initialSettings.agent_id]);

  const staticConfigQuery = useStaticConfigDataQuery(
    {
      agentId: initialSettings.agent_id,
    },
    {
      enabled: !getLocalStorageData()?.prospectId,
    },
  );

  const initialiseCommandBar = useCallback(
    (initialConfig: ConfigurationApiResponse = {} as ConfigurationApiResponse) => {
      const { prospectId, sessionId, distinctId, tenantName: storageTenantName } = getLocalStorageData() ?? {};
      const tenantName = initialConfig.org_name ?? storageTenantName;

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
      setLocalStorageData({ tenantName });
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.PAGE_LOAD);
    },
    [setConfig, trackEvent, updateCommonProperties],
  );

  useEffect(() => {
    const { prospectId } = getLocalStorageData() ?? {};

    if (!prospectId) {
      setLocalStorageData({
        distinctId: nanoid(),
      });
    } else {
      initialiseCommandBar();
    }
  }, [initialiseCommandBar]);

  useEffect(() => {
    if (staticConfigQuery.data) {
      initialiseCommandBar(staticConfigQuery.data);
    }
  }, [staticConfigQuery.data, initialiseCommandBar]);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings, setSettings]);

  useBrandCoverImage(initialSettings.tenant_id, initialSettings.bc);

  useStyleConfig({ styleConfig: config?.style_config });

  if (staticConfigQuery.isSuccess || config.prospect_id) {
    return children;
  }

  return null;
};

export default PreloadContainer;
