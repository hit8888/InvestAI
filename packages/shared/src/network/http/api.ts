import apiClient from '@neuraltrade/core/http/client';

import { ConfigPayload } from '@neuraltrade/core/types/api/agent_config_request';
import { ConfigurationApiResponse } from '@neuraltrade/core/types/api/configuration_response';
import { InitializationPayload } from '@neuraltrade/core/types/api/session_init_request';
import { UpdateProspectPayload } from '@neuraltrade/core/types/api/update_prospect_request';
import { FormConfigResponse, InitSessionResponse } from '../../types/responses';
import { VideoLibraryResponse } from '@neuraltrade/core/types/api/video_library_response';
import { DemoLibraryResponse } from '@neuraltrade/core/types/api/demo_library_response';

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

export const getBookMeetingForm = (agentId: string, prospectId?: string) =>
  apiClient.get<FormConfigResponse>(`/tenant/chat/agent/${agentId}/form/`, {
    params: { prospect_id: prospectId },
  });

export const getVideoLibrary = (
  agentId: string,
  moduleId: string,
  sessionId: string,
  prospectId: string,
  parentUrl?: string,
) =>
  apiClient.post<VideoLibraryResponse>(`/tenant/chat/api/agent/${agentId}/command-bar/${moduleId}/videos/`, {
    session_id: sessionId,
    prospect_id: prospectId,
    url: parentUrl,
  });

export const getDemoLibrary = (
  agentId: string,
  moduleId: string,
  sessionId: string,
  prospectId: string,
  parentUrl?: string,
) =>
  apiClient.post<DemoLibraryResponse>(`/tenant/chat/api/agent/${agentId}/command-bar/${moduleId}/demos/`, {
    session_id: sessionId,
    prospect_id: prospectId,
    url: parentUrl,
  });
