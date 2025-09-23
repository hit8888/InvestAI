import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcps } from '@meaku/core/adminHttp/api';
import { IcpsResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

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
  const tenantName = getTenantFromLocalStorage();
  const companyName = payload.companyName;
  const domain = payload.domain;

  const icpsQuery = useQuery({
    queryKey: getIcpsKey(tenantName, companyName, domain),
    queryFn: async () => {
      try {
        if (!companyName && !domain) {
          throw new Error('Company name or domain is required');
        }

        const response = await getIcps({ company_name: companyName, domain: domain });
        return response.data;
      } catch (error) {
        let errorMessage = '';
        if (error instanceof AxiosError) {
          errorMessage = error.response?.data?.error ?? 'Error fetching ICPs';
        }
        toast.error(errorMessage);
        throw error;
      }
    },
    enabled: !!companyName,
    ...options,
  });

  return icpsQuery;
};

export default useIcpsQuery;
