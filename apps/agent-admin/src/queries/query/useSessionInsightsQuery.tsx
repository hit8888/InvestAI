import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSessionInsights } from '@meaku/core/adminHttp/api';
import {
  DailySessionInsightsResponse,
  HourlySessionInsightsResponse,
  WeeklySessionInsightsResponse,
} from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

interface IProps {
  start_date: string;
  end_date: string;
  timezone: string;
  insight_interval: 'hourly' | 'daily' | 'weekly';
  enabled?: boolean;
}

const useSessionInsightsQuery = <
  T extends DailySessionInsightsResponse | WeeklySessionInsightsResponse | HourlySessionInsightsResponse,
>({
  start_date,
  end_date,
  timezone,
  insight_interval,
  enabled = true,
}: IProps): UseQueryResult<T> => {
  const tenantName = getTenantFromLocalStorage();

  const hasAllRequiredParams = Boolean(start_date && end_date && timezone && insight_interval);

  const sessionInsightsQuery = useQuery({
    queryKey: ['session-insights', tenantName, start_date, end_date, timezone, insight_interval],
    queryFn: async (): Promise<T> => {
      const response = await getSessionInsights<T>({
        start_date,
        end_date,
        timezone,
        insight_interval,
      });

      return response.data;
    },
    enabled: enabled && hasAllRequiredParams,
  });

  return sessionInsightsQuery;
};

export default useSessionInsightsQuery;
