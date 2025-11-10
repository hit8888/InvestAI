import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getProductInterestDistribution } from '@meaku/core/adminHttp/api';
import { ProductInterestDistributionResponse } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

type UseProductInterestDistributionQueryProps = {
  payload: {
    start_date: string;
    end_date: string;
    timezone: string;
  };
  options?: Partial<UseQueryOptions<ProductInterestDistributionResponse>>;
};

const useProductInterestDistributionQuery = ({
  payload,
  options,
}: UseProductInterestDistributionQueryProps): UseQueryResult<ProductInterestDistributionResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const productInterestDistributionQuery = useQuery({
    queryKey: ['product-interest-distribution', tenantName, payload],
    queryFn: async (): Promise<ProductInterestDistributionResponse> => {
      const response = await getProductInterestDistribution(payload);
      return response.data;
    },
    ...options,
  });

  return productInterestDistributionQuery;
};

export default useProductInterestDistributionQuery;
