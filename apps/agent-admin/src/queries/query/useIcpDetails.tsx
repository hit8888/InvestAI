import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcpDetails } from '@meaku/core/adminHttp/api';
import { IcpDetailsResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

const getIcpDetailsKey = (tenantName: string, sessionID: string): unknown[] => [
  'session-details-data',
  tenantName,
  sessionID,
];

type IcpDetailsKey = ReturnType<typeof getIcpDetailsKey>;

type IcpDetailsQueryPayload = {
  companyName?: string | null;
};

type IcpDetailsQueryOptions = BreakoutQueryOptions<IcpDetailsResponse, IcpDetailsKey>;

const useIcpDetailsQuery = (
  payload: IcpDetailsQueryPayload = {},
  options: IcpDetailsQueryOptions = {},
): UseQueryResult<IcpDetailsResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const companyName = payload.companyName;

  const icpDetailsQuery = useQuery({
    queryKey: getIcpDetailsKey(tenantName, companyName!),
    queryFn: async () => {
      const response = await getIcpDetails({ company_name: companyName! });
      return response.data;
    },
    enabled: !!companyName,
    ...options,
  });

  return icpDetailsQuery;
};

export default useIcpDetailsQuery;
