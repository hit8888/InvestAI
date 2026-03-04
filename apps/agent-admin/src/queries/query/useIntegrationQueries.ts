import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getIntegrations } from '@neuraltrade/core/adminHttp/api';
import { IntegrationsResponse } from '@neuraltrade/core/types/admin/api';

const useIntegrationsQuery = (options?: Omit<UseQueryOptions<IntegrationsResponse, Error>, 'queryFn'>) => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await getIntegrations();
      return response.data;
    },
    ...options,
  });
};

export { useIntegrationsQuery };
