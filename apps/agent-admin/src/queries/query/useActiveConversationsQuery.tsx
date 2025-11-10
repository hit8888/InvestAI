import { AxiosResponse } from 'axios';
import { getActiveConversations } from '@meaku/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { ActiveConversation } from '../../context/ActiveConversationsContext';
import { useSessionStore } from '../../stores/useSessionStore';

const useActiveConversationsQuery = () => {
  const tenant = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const getaActiveConversationsQueryKey = (): unknown[] => {
    return ['active-conversations', tenant];
  };

  const activeConversationsQueryData = useQuery({
    queryKey: getaActiveConversationsQueryKey(),
    queryFn: async (): Promise<ActiveConversation[]> => {
      const response: AxiosResponse<ActiveConversation[]> = await getActiveConversations();
      return response.data;
    },
  });

  return activeConversationsQueryData;
};

export default useActiveConversationsQuery;
