import { type FC, type ReactNode, useEffect } from 'react';
import { nanoid } from 'nanoid';

import type { CommandBarSettings } from '@meaku/core/types/common';
import { getLocalStorageData, setLocalStorageData, setActiveTenantData } from '@meaku/core/utils/storage-utils';
import { setTenantHeader } from '@meaku/core/http/client';
import useStaticConfigDataQuery from '@meaku/shared/network/http/queries/useStaticConfigDataQuery';
import { useCommandBarStore } from '../stores/useCommandBarStore';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { CDN_URL_FOR_ASSETS } from '@meaku/core/constants/index';

interface Props {
  children: ReactNode;
  settings: CommandBarSettings;
}

const PreloadContainer: FC<Props> = ({ children, settings: initialSettings }) => {
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

  useEffect(() => {
    const boBcContainer = document.querySelector('#bo-bc-container') as HTMLElement;

    if (!boBcContainer || !initialSettings.bc) return;

    boBcContainer.style.backgroundImage = `url('${CDN_URL_FOR_ASSETS}/agents-website-SS/${initialSettings.tenant_id}.png')`;
    boBcContainer.style.backgroundSize = 'contain';
    boBcContainer.style.backgroundPosition = 'center';
    boBcContainer.style.backgroundRepeat = 'no-repeat';
    boBcContainer.style.overflow = 'hidden';
    boBcContainer.style.height = '100vh';
  }, [initialSettings.bc, initialSettings.tenant_id]);

  if (staticConfigQuery.isSuccess && !!config.command_bar) {
    return children;
  }

  return null;
};

export default PreloadContainer;
