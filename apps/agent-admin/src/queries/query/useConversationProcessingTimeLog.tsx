import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getConversationProcessingTimeLog } from '@neuraltrade/core/adminHttp/api';
import { ConversationProcessingTimeLogResponse } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

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
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

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
