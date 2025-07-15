import { ConversationsTableDisplayContent, ConversationsTableViewContent } from '../types/admin/admin';

export const convertServerConversationDataToClientConversationData = (
  response: ConversationsTableViewContent,
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
    buyer_intent_score: response.buyer_intent, // Need to Find Logic or Directly getting from api
    bant_analysis: '-', // Need to Find Logic or Directly getting from api
    user_message_count: `${response.user_message_count || 0}`,
    meeting_status: '-', // Static for now, can be dynamic if additional info is provided
    product_of_interest: response.product_of_interest || '-',
    ip_address: response.ip_address || '-',
    session_id: response.session_id || '-',
    prospect_details: response.prospect_details || {},
    company_details: response.company_details || {},
    agent_modal: response.agent_modal,
  };
};
