import { AxiosResponse } from 'axios';
import { getActiveConversations } from '@meaku/core/adminHttp/api';
import { useQuery } from '@tanstack/react-query';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { ActiveConversation } from '../../context/ActiveConversationsContext';

const useActiveConversations = () => {
  const getaActiveConversationsQueryKey = (): unknown[] => {
    const tenant = getTenantFromLocalStorage();
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

export default useActiveConversations;
