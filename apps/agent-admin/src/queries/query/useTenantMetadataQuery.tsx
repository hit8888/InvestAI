import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';

import { getTenantMetadata } from '@meaku/core/adminHttp/api';
import { TenantMetadataResponse } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

interface IProps {
  queryOptions?: Omit<UseQueryOptions<TenantMetadataResponse, Error>, 'queryKey' | 'queryFn'>;
}

const useTenantMetadataQuery = ({ queryOptions }: IProps = {}): UseQueryResult<TenantMetadataResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useQuery({
    queryKey: ['tenant-metadata', tenantName],
    queryFn: async (): Promise<TenantMetadataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<TenantMetadataResponse> = await getTenantMetadata(tenantName);
      return response.data;
    },
    retry: (failureCount, error) => {
      // Don't retry if it's a 404 error
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      // For other errors, retry up to 3 times
      return failureCount < 3;
    },
    enabled: !!tenantName,
    ...queryOptions,
  });
};

export default useTenantMetadataQuery;
