import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getInsightsSummary } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { InsightsSummaryResponse } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

interface IProps {
  start_date: string;
  end_date: string;
  timezone: string;
  enabled?: boolean;
}

const useInsightsSummaryQuery = ({
  start_date,
  end_date,
  timezone,
  enabled = true,
}: IProps): UseQueryResult<InsightsSummaryResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const hasAllRequiredParams = Boolean(start_date && end_date && timezone);

  const insightsSummaryQuery = useQuery({
    queryKey: ['insights-summary', tenantName, start_date, end_date, timezone],
    queryFn: async (): Promise<InsightsSummaryResponse> => {
      const response: AxiosResponse<InsightsSummaryResponse> = await getInsightsSummary({
        start_date,
        end_date,
        timezone,
      });
      return response.data;
    },
    enabled: enabled && hasAllRequiredParams,
  });

  return insightsSummaryQuery;
};

export default useInsightsSummaryQuery;
