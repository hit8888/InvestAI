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
    timeline: response.timeline || '-',
    conversation_preview: response.summary || '-',
    location: response.country || '-',
    buyer_intent: response.buyer_intent_score, // Need to Find Logic or Directly getting from api
    bant_analysis: '-', // Need to Find Logic or Directly getting from api
    number_of_user_messages: `${response.user_message_count || 0}`,
    meeting_status: '-', // Static for now, can be dynamic if additional info is provided
    product_of_interest: response.product_of_interest || '-',
    ip_address: response.ip_address || '-',
    session_id: response.session_id || '-',
    prospect_details: response.prospect_details || {},
    company_details: response.company_details || {},
  };
};
