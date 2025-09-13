import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSessionDetailsData } from '@meaku/core/adminHttp/api';
import { ConversationDetailsDataResponse, SessionDetailsDataResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

const getConversationDetailsDataKey = (tenantName: string, sessionID: string): unknown[] => [
  'conversation-details-data',
  tenantName,
  sessionID,
];

type ConversationDetailsDataKey = ReturnType<typeof getConversationDetailsDataKey>;

interface IProps {
  sessionID: string;
  queryOptions: BreakoutQueryOptions<ConversationDetailsDataResponse, ConversationDetailsDataKey>;
}

const normalizeSessionToConversationData = (
  sessionData: SessionDetailsDataResponse,
): ConversationDetailsDataResponse => {
  // Transform SessionDetailsDataResponse to match ConversationDetailsDataResponse structure
  const { chat_history, chat_summary, prospect, session } = sessionData;

  const conversation = {
    session_id: session?.session_id || null,
    role: prospect?.role || null,
    timestamp: session?.start_time || null,
    email: prospect?.email || null,
    name: prospect?.name || null,
    company: prospect?.company || null,
    buyer_intent: null, // Not available in session data
    buyer_intent_score: session?.buyer_intent_score || null,
    user_message_count: 0, // Not available in session data
    product_of_interest: prospect?.product_interest || null,
    summary: chat_summary || null,
    parent_url: prospect?.parent_url || null,
    ip_address: prospect?.ip_address || session?.metadata?.ip_address || null,
    query_params: prospect?.query_params || null,
    prospect_details: {
      ip_address: prospect?.prospect_demographics?.ip_address || undefined,
      query_params: prospect?.query_params || undefined,
      loc: prospect?.prospect_demographics?.loc || undefined,
      city: prospect?.prospect_demographics?.city || undefined,
      region: prospect?.prospect_demographics?.region || undefined,
      country: prospect?.prospect_demographics?.country || undefined,
      timezone: prospect?.prospect_demographics?.timezone || undefined,
      enrichment_source: undefined,
      linkedin_url: undefined,
      enriched_info: undefined,
      role: prospect?.role || undefined,
      budget: prospect?.budget || undefined,
      timeline: prospect?.timeline || undefined,
      product_interest: prospect?.product_interest || undefined,
    },
    company_details: prospect?.company_demographics || {},
    budget: prospect?.budget || null,
    need: prospect?.need || null,
    timeline: prospect?.timeline || null,
    country: prospect?.country || prospect?.prospect_demographics?.country || null,
    device_type: null, // Not available in session data
    agent_modal: null, // Not available in session data
    parent_url_title: null, // Not available in session data
    browsing_analysis_summary: null, // Not available in session data
    is_test: session?.is_test || false,
  };

  return {
    conversation,
    chat_history: chat_history || [],
    feedback: [], // Initialize with empty array since it's optional
  };
};

const useConversationDetailsDataQuery = ({
  sessionID,
  queryOptions,
}: IProps): UseQueryResult<ConversationDetailsDataResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const detailsQuery = useQuery({
    queryKey: getConversationDetailsDataKey(tenantName ?? '', sessionID ?? ''),
    queryFn: async (): Promise<ConversationDetailsDataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      if (!sessionID) throw new Error('Session ID is undefined');
      const response = await getSessionDetailsData(sessionID);
      return normalizeSessionToConversationData(response.data);
    },
    enabled: !!sessionID,
    ...queryOptions,
  });

  return detailsQuery;
};

export default useConversationDetailsDataQuery;
