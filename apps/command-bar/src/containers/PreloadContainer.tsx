import { type FC, type ReactNode, useEffect } from 'react';
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
      enabled: !!initialSettings.tenant_id && !!initialSettings.agent_id,
    },
  );

  useEffect(() => {
    const storageData = getLocalStorageData();

    if (!storageData) {
      setLocalStorageData({
        distinctId: nanoid(),
      });
    }
  }, []);

  useEffect(() => {
    if (staticConfigQuery.data) {
      const { prospectId, sessionId, distinctId } = getLocalStorageData() ?? {};

      setConfig({
        ...staticConfigQuery.data,
        session_id: sessionId,
        prospect_id: prospectId,
      });
      updateCommonProperties({
        tenant_name: staticConfigQuery.data.org_name,
        session_id: sessionId,
        prospect_id: prospectId,
        distinct_id: distinctId,
      });
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.PAGE_LOAD);
    }
  }, [staticConfigQuery.data, setConfig, trackEvent, updateCommonProperties]);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings, setSettings]);

  useBrandCoverImage(initialSettings.tenant_id, initialSettings.bc);

  useStyleConfig({ styleConfig: config?.style_config });

  if (staticConfigQuery.isSuccess && !!config.command_bar) {
    return children;
  }

  return null;
};

export default PreloadContainer;
