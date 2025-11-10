import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcps } from '@meaku/core/adminHttp/api';
import { IcpsResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { useSessionStore } from '../../stores/useSessionStore';

const getIcpsKey = (tenantName: string, companyName?: string | null, domain?: string | null): unknown[] => [
  'icps-data',
  tenantName,
  companyName,
  domain,
];

type IcpsKey = ReturnType<typeof getIcpsKey>;

type IcpsQueryPayload = {
  companyName?: string | null;
  domain?: string | null;
};

type IcpsQueryOptions = BreakoutQueryOptions<IcpsResponse, IcpsKey>;

const useIcpsQuery = (payload: IcpsQueryPayload = {}, options: IcpsQueryOptions = {}): UseQueryResult<IcpsResponse> => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';
  const companyName = payload.companyName;
  const domain = payload.domain;

  const icpsQuery = useQuery({
    queryKey: getIcpsKey(tenantName ?? '', companyName, domain),
    queryFn: async () => {
      if (!companyName && !domain) {
        throw new Error('Company name or domain is required');
      }

      const response = await getIcps({ company_name: companyName, domain: domain });
      return response.data;
    },
    enabled: !!companyName,
    ...options,
  });

  return icpsQuery;
};

export default useIcpsQuery;
