import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getInsightsSummary } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { InsightsSummaryResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

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
  const tenantName = getTenantFromLocalStorage();

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
