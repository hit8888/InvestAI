import { SessionConfigResponseType } from "@meaku/core/managers/UnifiedSessionConfigResponseManager";
import { UseQueryResult } from "@tanstack/react-query";
import { ConfigurationApiResponse } from "./api/configuration_response";
import { SessionApiResponse } from "./api/session_init_response";

export interface IAllApiResponsesWithQuery {
  unifiedConfigurationResponse: SessionConfigResponseType;
  configQuery: UseQueryResult<ConfigurationApiResponse>;
  sessionQuery: UseQueryResult<SessionApiResponse>;
}
