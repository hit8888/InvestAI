import type { FC, ReactElement } from 'react';
import { useMemo } from 'react';
import { CommandBarSettings } from '@meaku/shared/types/common';
import { ensureProtocol, jsonSafeParse } from '@meaku/core/utils/index';
import { getUrlParams } from '@meaku/core/utils/routing-utils';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';

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

const SettingsContainer: FC<SettingsContainerProps> = (props) => {
  const {
    children,
    tenantId: propTenantId,
    agentId: propAgentId,
    enabled: propEnabled,
    message: propMessage,
    startTime: propStartTime,
    endTime: propEndTime,
    sessionId: propSessionId,
    prospectId: propProspectId,
    bc: propBc,
    isAdmin: propIsAdmin,
    isTest: propIsTest,
    browsedUrls: propBrowsedUrls,
    queryParams: propQueryParams,
    parentUrl: propParentUrl,
    position: propPosition,
    rootZindex: propRootZIndex,
    rootBottomOffset: propRootBottomOffset,
    rootRightOffset: propRootRightOffset,
    feedbackEnabled: propFeedbackEnabled,
    activeModule: propActiveModule,
  } = props;

  const settings = useMemo((): CommandBarSettings => {
    const urlParams = getUrlParams();

    let parsedPropMessage: string | undefined;
    let parsedPropActiveModule: string | undefined;

    if (propMessage) {
      const parseResult = jsonSafeParse(propMessage);
      // Message can be either a string or a json object with a content property
      parsedPropMessage = parseResult.error ? propMessage : parseResult.data.content;
    }

    if (propActiveModule) {
      const parsed = jsonSafeParse(propActiveModule);
      // Active module can be either a string or a json object with a module_type property
      parsedPropActiveModule = parsed.error ? propActiveModule : parsed.data.module_type;
    }

    return {
      tenant_id: urlParams.tenant_id ?? propTenantId,
      agent_id: urlParams.agent_id ?? propAgentId,
      enabled: jsonSafeParse(urlParams.enabled).data ?? propEnabled,
      message: urlParams.message ?? parsedPropMessage,
      start_time: urlParams.start_time ?? propStartTime,
      end_time: urlParams.end_time ?? propEndTime,
      parent_url: ensureProtocol(urlParams.parent_url ?? propParentUrl ?? window.location.href),
      session_id: urlParams.session_id ?? propSessionId,
      prospect_id: urlParams.prospect_id ?? propProspectId,
      browsed_urls: jsonSafeParse(urlParams.browsed_urls).data ?? propBrowsedUrls,
      bc: jsonSafeParse(urlParams.bc).data ?? propBc,
      is_test: jsonSafeParse(urlParams.is_test).data ?? propIsTest ?? false,
      is_admin: jsonSafeParse(urlParams.is_admin).data ?? propIsAdmin ?? false,
      query_params: jsonSafeParse(urlParams.query_params).data ?? propQueryParams,
      position: urlParams.position ?? propPosition,
      root_zindex: urlParams.root_z_index ?? propRootZIndex,
      root_bottom_offset: urlParams.root_bottom_offset ?? propRootBottomOffset,
      root_right_offset: urlParams.root_right_offset ?? propRootRightOffset,
      feedback_enabled: jsonSafeParse(urlParams.feedback_enabled).data ?? propFeedbackEnabled ?? false,
      active_module:
        CommandBarModuleTypeSchema.safeParse(urlParams.active_module ?? parsedPropActiveModule).data ?? null,
    };
  }, [
    propTenantId,
    propAgentId,
    propEnabled,
    propMessage,
    propStartTime,
    propEndTime,
    propParentUrl,
    propSessionId,
    propProspectId,
    propBrowsedUrls,
    propBc,
    propIsTest,
    propIsAdmin,
    propQueryParams,
    propPosition,
    propRootZIndex,
    propRootBottomOffset,
    propRootRightOffset,
    propFeedbackEnabled,
    propActiveModule,
  ]);

  return children(settings);
};

export default SettingsContainer;
