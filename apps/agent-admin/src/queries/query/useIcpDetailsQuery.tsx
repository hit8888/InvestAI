import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcpDetails } from '@meaku/core/adminHttp/api';
import { IcpDetailsResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

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
  const tenantName = getTenantFromLocalStorage();
  const icpId = payload.icpId;

  const icpDetailsQuery = useQuery({
    queryKey: getIcpDetailsKey(tenantName, icpId!),
    queryFn: async () => {
      const response = await getIcpDetails({ icp_id: icpId! });
      return response.data;
    },
    enabled: !!icpId,
    ...options,
  });

  return icpDetailsQuery;
};

export default useIcpDetailsQuery;
