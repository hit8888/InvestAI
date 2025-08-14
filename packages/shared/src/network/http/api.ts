import apiClient from '@meaku/core/http/client';

import { ConfigPayload } from '@meaku/core/types/api/agent_config_request';
import { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import { InitializationPayload } from '@meaku/core/types/api/session_init_request';
import { UpdateProspectPayload } from '@meaku/core/types/api/update_prospect_request';
import { InitSessionResponse } from '../../types/responses';

export const getNudge = (agentId: string, payload: ConfigPayload) =>
  apiClient.post(`/tenant/chat/v2/agent/${agentId}/config/`, { ...payload });

export const getStaticConfig = (agentId: string) =>
  apiClient.get<ConfigurationApiResponse>(`/tenant/chat/v2/agent/${agentId}/config/static/`);

export const getConfig = (agentId: string, payload: ConfigPayload) =>
  apiClient.post<ConfigurationApiResponse>(
    `/tenant/chat/v2/agent/${agentId}/config/`,
    { ...payload },
    {
      timeout: 15000,
    },
  );

export const initializeSession = (agentId: string, payload: InitializationPayload) =>
  apiClient.post<InitSessionResponse>(`/tenant/chat/agent/${agentId}/session/init/`, payload);

export const updateProspect = (prospectId: string, payload: UpdateProspectPayload) =>
  apiClient.post(`/tenant/chat/prospect/${prospectId}/update/`, payload);
