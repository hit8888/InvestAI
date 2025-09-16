import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcps } from '@meaku/core/adminHttp/api';
import { IcpsResponse } from '@meaku/core/types/admin/admin';
import { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import toast from 'react-hot-toast';

const getIcpsKey = (tenantName: string, companyName: string): unknown[] => ['icps-data', tenantName, companyName];

type IcpsKey = ReturnType<typeof getIcpsKey>;

type IcpsQueryPayload = {
  companyName?: string | null;
};

type IcpsQueryOptions = BreakoutQueryOptions<IcpsResponse, IcpsKey>;

const useIcpsQuery = (payload: IcpsQueryPayload = {}, options: IcpsQueryOptions = {}): UseQueryResult<IcpsResponse> => {
  const tenantName = getTenantFromLocalStorage();
  const companyName = payload.companyName;

  const icpsQuery = useQuery({
    queryKey: getIcpsKey(tenantName, companyName!),
    queryFn: async () => {
      try {
        const response = await getIcps({ company_name: companyName! });
        return response.data;
      } catch (error) {
        toast.error('Error fetching ICPs');
        throw error;
      }
    },
    enabled: !!companyName,
    ...options,
  });

  return icpsQuery;
};

export default useIcpsQuery;
