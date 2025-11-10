import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getCountryDistribution } from '@meaku/core/adminHttp/api';
import { CountryDistributionResponse } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

type UseCountryDistributionQueryProps = {
  payload: {
    start_date: string;
    end_date: string;
    timezone: string;
  };
  options?: Partial<UseQueryOptions<CountryDistributionResponse>>;
};

const useCountryDistributionQuery = ({
  payload,
  options,
}: UseCountryDistributionQueryProps): UseQueryResult<CountryDistributionResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const countryDistributionQuery = useQuery({
    queryKey: ['country-distribution', tenantName, payload],
    queryFn: async (): Promise<CountryDistributionResponse> => {
      const response = await getCountryDistribution(payload);
      return response.data;
    },
    ...options,
  });

  return countryDistributionQuery;
};

export default useCountryDistributionQuery;
