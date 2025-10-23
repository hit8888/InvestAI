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

const SettingsContainer: FC<SettingsContainerProps> = (props) => {
  const {
    children,
    tenantId: propTenantId,
    agentId: propAgentId,
    visible: propVisible,
    message: propMessage,
    startTime: propStartTime,
    endTime: propEndTime,
    sessionId: propSessionId,
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
  } = props;

  const settings = useMemo((): CommandBarSettings => {
    const urlParams = getUrlParams();

    let parsedPropMessage: string | undefined;
    if (propMessage) {
      const parseResult = jsonSafeParse(propMessage);
      // Message can be either a string or a json object with a content property
      parsedPropMessage = parseResult.error ? propMessage : parseResult.data.content;
    }

    return {
      tenant_id: urlParams.tenant_id ?? propTenantId,
      agent_id: urlParams.agent_id ?? propAgentId,
      visible: jsonSafeParse(urlParams.visible).data ?? propVisible,
      message: urlParams.message ?? parsedPropMessage,
      start_time: urlParams.start_time ?? propStartTime,
      end_time: urlParams.end_time ?? propEndTime,
      parent_url: urlParams.parent_url ?? propParentUrl ?? window.location.href,
      session_id: urlParams.session_id ?? propSessionId,
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
    };
  }, [
    propTenantId,
    propAgentId,
    propVisible,
    propMessage,
    propStartTime,
    propEndTime,
    propParentUrl,
    propSessionId,
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
  ]);

  return children(settings);
};

export default SettingsContainer;
