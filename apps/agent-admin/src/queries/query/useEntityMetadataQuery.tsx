import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getEntityDataBasedOnType } from '@meaku/core/adminHttp/api';
import { AxiosError, AxiosResponse } from 'axios';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { EntityMetadataResponseType } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

const getEntityMetadataKey = (entityType: string, tenantName: string): readonly unknown[] => [
  'entity-metadata',
  entityType,
  tenantName,
];

interface IProps {
  entityType: string;
  queryOptions: BreakoutQueryOptions<EntityMetadataResponseType, readonly unknown[]>;
}

const useEntityMetadataQuery = ({ entityType, queryOptions }: IProps): UseQueryResult<EntityMetadataResponseType> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  return useQuery({
    queryKey: getEntityMetadataKey(entityType, tenantName ?? ''),
    queryFn: async (): Promise<EntityMetadataResponseType> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<EntityMetadataResponseType> = await getEntityDataBasedOnType(entityType);
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
    ...queryOptions,
  });
};

export default useEntityMetadataQuery;
