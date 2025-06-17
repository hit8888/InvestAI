import { getTopQuestionsByUser } from '@meaku/core/adminHttp/api';
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

const useTopQuestionsByUsers = ({ start_date, end_date, timezone, enabled = true }: IProps) => {
  const tenantName = getTenantFromLocalStorage();

  const hasAllRequiredParams = Boolean(start_date && end_date && timezone);

  const topQuestionsByUsersInsightsQuery = useQuery({
    queryKey: ['top-questions-by-users', tenantName, start_date, end_date, timezone],
    queryFn: async (): Promise<TopQuestionsByUserResponse> => {
      const response: AxiosResponse<TopQuestionsByUserResponse> = await getTopQuestionsByUser({
        start_date,
        end_date,
        timezone,
      });

      return response.data;
    },
    enabled: enabled && hasAllRequiredParams,
  });

  return topQuestionsByUsersInsightsQuery;
};

export default useTopQuestionsByUsers;
