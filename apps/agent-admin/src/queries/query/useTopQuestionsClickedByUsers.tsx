import { getTopQuestionsClickedByUser } from '@meaku/core/adminHttp/api';
import { TopQuestionsByUserResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface IProps {
  start_date: string;
  end_date: string;
  timezone: string;
  enabled?: boolean;
}

const useTopQuestionsClickedByUsers = ({ start_date, end_date, timezone, enabled = true }: IProps) => {
  const tenantName = getTenantFromLocalStorage();

  const hasAllRequiredParams = Boolean(start_date && end_date && timezone);

  const topQuestionsClickedByUsersQuery = useQuery({
    queryKey: ['top-questions-clicked-by-users', tenantName, start_date, end_date, timezone],
    queryFn: async (): Promise<TopQuestionsByUserResponse> => {
      const response: AxiosResponse<TopQuestionsByUserResponse> = await getTopQuestionsClickedByUser({
        start_date,
        end_date,
        timezone,
      });

      return response.data;
    },
    enabled: enabled && hasAllRequiredParams,
  });

  return topQuestionsClickedByUsersQuery;
};

export default useTopQuestionsClickedByUsers;
