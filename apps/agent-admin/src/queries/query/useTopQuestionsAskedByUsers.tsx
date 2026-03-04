import { getTopQuestionsAskedByUser } from '@neuraltrade/core/adminHttp/api';
import { TopQuestionsByUserResponse } from '@neuraltrade/core/types/admin/api';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useSessionStore } from '../../stores/useSessionStore';

interface IProps {
  start_date: string;
  end_date: string;
  timezone: string;
  enabled?: boolean;
}

const useTopQuestionsAskedByUsers = ({ start_date, end_date, timezone, enabled = true }: IProps) => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const hasAllRequiredParams = Boolean(start_date && end_date && timezone);

  const topQuestionsAskedByUsersQuery = useQuery({
    queryKey: ['top-questions-asked-by-users', tenantName, start_date, end_date, timezone],
    queryFn: async (): Promise<TopQuestionsByUserResponse> => {
      const response: AxiosResponse<TopQuestionsByUserResponse> = await getTopQuestionsAskedByUser({
        start_date,
        end_date,
        timezone,
      });

      return response.data;
    },
    enabled: enabled && hasAllRequiredParams,
  });

  return topQuestionsAskedByUsersQuery;
};

export default useTopQuestionsAskedByUsers;
