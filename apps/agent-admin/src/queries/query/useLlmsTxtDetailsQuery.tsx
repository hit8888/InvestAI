import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getLlmsTxtDetails } from '@neuraltrade/core/adminHttp/api';
import { AxiosResponse } from 'axios';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

// Types
export type LlmTxtStatus = 'in_progress' | 'completed' | 'error';

export interface LlmsTxtDetailsResponse {
  exists: boolean;
  status: LlmTxtStatus | null;
  asset_id: string | null;
  last_updated: string | null;
  error_message: string | null;
  expected_time_left: string | null;
}

const getLlmsTxtDetailsKey = (tenantName: string, dataSourceId: number): unknown[] => [
  'llms-txt-details',
  tenantName,
  dataSourceId,
];

type LlmsTxtDetailsKey = ReturnType<typeof getLlmsTxtDetailsKey>;

interface IProps {
  dataSourceId: number;
  queryOptions?: BreakoutQueryOptions<LlmsTxtDetailsResponse, LlmsTxtDetailsKey>;
}

const useLlmsTxtDetailsQuery = ({ dataSourceId, queryOptions }: IProps): UseQueryResult<LlmsTxtDetailsResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useQuery({
    queryKey: getLlmsTxtDetailsKey(tenantName ?? '', dataSourceId),
    queryFn: async (): Promise<LlmsTxtDetailsResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<LlmsTxtDetailsResponse> = await getLlmsTxtDetails(dataSourceId);
      return response.data;
    },
    ...queryOptions,
  });
};

export default useLlmsTxtDetailsQuery;
