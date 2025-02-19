import { UseQueryResult } from '@tanstack/react-query';
import { ConfigurationApiResponse } from './api/configuration_response';
import { SessionApiResponse } from './api/session_init_response';

export interface IAllApiResponsesWithQuery {
  configurationApiResponse: ConfigurationApiResponse;
  sessionApiResponse: SessionApiResponse | null;
  configQuery: UseQueryResult<ConfigurationApiResponse>;
  sessionQuery: UseQueryResult<SessionApiResponse>;
}
