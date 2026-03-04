import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getBuyerIntentDistribution } from '@neuraltrade/core/adminHttp/api';
import { BuyerIntentDistributionResponse } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

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
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

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
