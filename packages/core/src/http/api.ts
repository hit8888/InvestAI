import { ConfigPayload } from '../types/api/agent_config_request';
import { FeedbackRequestPayload } from '../types/api/feedback_request';
import { InitializationPayload } from '../types/api/session_init_request';
import { UpdateSessionDataPayload } from '../types/api/session_update_request';
import { UpdateProspectPayload } from '../types/api/update_prospect_request';
import apiClient from './client';

export const getConfig = (agentId: string, payload: ConfigPayload) =>
  apiClient.post(`/tenant/chat/agent/${agentId}/config/`, { ...payload });

export const initializeSession = (agentId: string, payload: InitializationPayload) =>
  apiClient.post(`/tenant/chat/agent/${agentId}/session/init/`, payload);

export const updateSession = (sessionId: string, payload: UpdateSessionDataPayload) =>
  apiClient.post(`/tenant/chat/session/${sessionId}/update/`, payload);

export const postResponseFeedback = (sessionId: string, payload: FeedbackRequestPayload) => {
  return apiClient.post(`/tenant/chat/session/${sessionId}/feedback/`, payload);
};

export const updateProspect = (prospectId: string, payload: UpdateProspectPayload) =>
  apiClient.post(`/tenant/chat/prospect/${prospectId}/update/`, payload);
