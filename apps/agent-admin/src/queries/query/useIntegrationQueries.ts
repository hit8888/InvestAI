import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getIntegrations } from '@meaku/core/adminHttp/api';
import { IntegrationsResponse } from '@meaku/core/types/admin/api';

const useIntegrationsQuery = (options?: Omit<UseQueryOptions<IntegrationsResponse, Error>, 'queryFn'>) => {
  const query = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await getIntegrations();
      return response.data;
    },
    ...options,
  });

  return query;
};

export { useIntegrationsQuery };
