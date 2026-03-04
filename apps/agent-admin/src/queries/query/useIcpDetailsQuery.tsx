import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcpDetails } from '@neuraltrade/core/adminHttp/api';
import { IcpDetailsResponse } from '@neuraltrade/core/types/admin/admin';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const getIcpDetailsKey = (tenantName: string, icpId: number): unknown[] => ['icp-details-data', tenantName, icpId];

type IcpDetailsKey = ReturnType<typeof getIcpDetailsKey>;

type IcpDetailsQueryPayload = {
  icpId?: number | null;
};

type IcpDetailsQueryOptions = BreakoutQueryOptions<IcpDetailsResponse, IcpDetailsKey>;

const useIcpDetailsQuery = (
  payload: IcpDetailsQueryPayload = {},
  options: IcpDetailsQueryOptions = {},
): UseQueryResult<IcpDetailsResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';
  const icpId = payload.icpId;

  const icpDetailsQuery = useQuery({
    queryKey: getIcpDetailsKey(tenantName ?? '', icpId!),
    queryFn: async () => {
      try {
        const response = await getIcpDetails({ icp_id: icpId! });
        return response.data;
      } catch (error) {
        let errorMessage = '';
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.error ?? 'Error fetching ICP details';
        }
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!icpId,
    ...options,
  });

  return icpDetailsQuery;
};

export default useIcpDetailsQuery;
