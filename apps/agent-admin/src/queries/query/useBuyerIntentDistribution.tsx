import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getBuyerIntentDistribution } from '@meaku/core/adminHttp/api';
import { BuyerIntentDistributionResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

type UseBuyerIntentDistributionQueryProps = {
  payload: {
    start_date: string;
    end_date: string;
    timezone: string;
  };
  options?: Partial<UseQueryOptions<BuyerIntentDistributionResponse>>;
};

const useBuyerIntentDistributionQuery = ({
  payload,
  options,
}: UseBuyerIntentDistributionQueryProps): UseQueryResult<BuyerIntentDistributionResponse> => {
  const tenantName = getTenantFromLocalStorage();

  const buyerIntentDistributionQuery = useQuery({
    queryKey: ['buyer-intent-distribution', tenantName, payload],
    queryFn: async (): Promise<BuyerIntentDistributionResponse> => {
      const response = await getBuyerIntentDistribution(payload);
      return response.data;
    },
    ...options,
  });

  return buyerIntentDistributionQuery;
};

export default useBuyerIntentDistributionQuery;
