import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getConversationProcessingTimeLog } from '@meaku/core/adminHttp/api';
import { ConversationProcessingTimeLogResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

type UseConversationProcessingTimeLogQueryProps = {
  payload: {
    start_date: string;
    end_date: string;
    timezone: string;
  };
  options?: Partial<UseQueryOptions<ConversationProcessingTimeLogResponse>>;
};

const useConversationProcessingTimeLogQuery = ({
  payload,
  options,
}: UseConversationProcessingTimeLogQueryProps): UseQueryResult<ConversationProcessingTimeLogResponse> => {
  const tenantName = getTenantFromLocalStorage();

  const conversationProcessingTimeLogQuery = useQuery({
    queryKey: ['processing-time-logs', tenantName, payload],
    queryFn: async (): Promise<ConversationProcessingTimeLogResponse> => {
      const response = await getConversationProcessingTimeLog(payload);
      return response.data;
    },
    ...options,
  });

  return conversationProcessingTimeLogQuery;
};

export default useConversationProcessingTimeLogQuery;
