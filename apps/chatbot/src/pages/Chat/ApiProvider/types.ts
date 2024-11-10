import { SessionConfigResponseType } from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { ConfigurationApiResponse, SessionApiResponse } from '@meaku/core/types/session';
import { UseQueryResult } from '@tanstack/react-query';


export interface IAllApiResponsesWithQuery {
  unifiedConfigurationResponse: SessionConfigResponseType,
  configQuery: UseQueryResult<ConfigurationApiResponse>
  sessionQuery: UseQueryResult<SessionApiResponse>
}
