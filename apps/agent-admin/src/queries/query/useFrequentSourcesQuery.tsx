import { getFrequentSourcesInsights } from '@meaku/core/adminHttp/api';
import { FrequentDocumentsResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface IProps {
  start_date: string;
  end_date: string;
  timezone: string;
  enabled?: boolean;
}

const useFrequentSourcesQuery = ({ start_date, end_date, timezone, enabled = true }: IProps) => {
  const tenantName = getTenantFromLocalStorage();

  const hasAllRequiredParams = Boolean(start_date && end_date && timezone);

  const frequentSourcesInsightsQuery = useQuery({
    queryKey: ['frequent-sources', tenantName, start_date, end_date, timezone],
    queryFn: async (): Promise<FrequentDocumentsResponse> => {
      const response: AxiosResponse<FrequentDocumentsResponse> = await getFrequentSourcesInsights({
        start_date,
        end_date,
        timezone,
      });

      return response.data;
    },
    enabled: enabled && hasAllRequiredParams,
  });

  return frequentSourcesInsightsQuery;
};

export default useFrequentSourcesQuery;
