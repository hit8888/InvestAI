import { ConversationDetailResponse, ConversationsTableDisplayContent } from '../types/admin/admin';

export const convertServerConversationDataToClientConversationData = (
  response: ConversationDetailResponse,
): ConversationsTableDisplayContent => {
  return {
    company: response.company || '-',
    name: response.name || '-',
    email: response.email || '-',
    timestamp: response.timestamp ? new Date(response.timestamp).toISOString().replace('T', ' ').split('.')[0] : '-',
    role: response.role || '-',
    budget: response.budget || '-',
    authority: response.role || '-',
    need: response.need || '-',
    timeline: response.timeline || '-',
    summary: response.summary || '-',
    country: response.country || '-',
    buyer_intent: response.buyer_intent,
    buyer_intent_score: response.buyer_intent_score,
    bant_analysis: '-',
    user_message_count: `${response.user_message_count || 0}`,
    meeting_status: '-',
    product_of_interest: response.product_of_interest || '-',
    ip_address: response.ip_address || response.prospect_details?.ip_address || '-',
    session_id: response.session_id || '-',
    prospect_details: response.prospect_details || {},
    company_details: response.company_details || {},
    agent_modal: response.agent_modal,
    parent_url: response.parent_url,
    parent_url_title: response.parent_url_title,
    query_params: response.query_params || {},
    device_type: response.device_type,
    browsing_analysis_summary: response.browsing_analysis_summary,
    sdr_assignment: response.sdr_assignment,
    prospect_id: response.prospect_id,
  };
};
