import type { FC, ReactElement } from 'react';
import { useMemo } from 'react';
import { CommandBarSettings } from '@meaku/core/types/common';
import { jsonSafeParse } from '@meaku/core/utils/index';
import { getUrlParams } from '@meaku/core/utils/routing-utils';

// Helper type to convert snake_case to camelCase
type ToCamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<ToCamelCase<U>>}` : S;

// Utility type to convert all properties to camelCase
type CamelCase<T> = {
  [K in keyof T as ToCamelCase<K & string>]: T[K];
};

// Create the camelCase version of CommandBarSettings for web component attributes
type WebComponentAttributes = CamelCase<CommandBarSettings>;

export type SettingsContainerProps = {
  children: (settings: CommandBarSettings) => ReactElement | null;
} & Partial<WebComponentAttributes>;

const SettingsContainer: FC<SettingsContainerProps> = ({
  children,
  tenantId: propTenantId,
  agentId: propAgentId,
  visible: propVisible,
  message: propMessage,
  startTime: propStartTime,
  endTime: propEndTime,
  sessionId: propSessionId,
  bc: propBc,
}) => {
  const settings = useMemo((): CommandBarSettings => {
    const urlParams = getUrlParams();

    return {
      tenant_id: urlParams.tenant_id ?? propTenantId,
      agent_id: urlParams.agent_id ?? propAgentId,
      visible: jsonSafeParse(urlParams.visible).data ?? propVisible,
      message: urlParams.message ?? propMessage,
      start_time: urlParams.start_time ?? propStartTime,
      end_time: urlParams.end_time ?? propEndTime,
      parent_url: urlParams.parent_url ?? window.location.href,
      session_id: urlParams.session_id ?? propSessionId,
      browsed_urls: jsonSafeParse(urlParams.browsed_urls).data,
      bc: jsonSafeParse(urlParams.bc).data ?? propBc,
    };
  }, [propTenantId, propAgentId, propVisible, propMessage, propStartTime, propEndTime, propSessionId, propBc]);

  return children(settings);
};

export default SettingsContainer;
