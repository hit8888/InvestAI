import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getAgentIdFromTenant } from '../utils/apiCalls';
import { useEffect, useState } from 'react';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

const usePlaygroundOptions = () => {
  const { tenantName: tenantNameParam } = useParams();
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const matchingOrg = orgList?.find((org) => org['tenant-name'] === tenantNameParam);

  const [orgAgentId, setOrgAgentId] = useState<number | null>(null);

  useEffect(() => {
    const getOrgAgentId = async () => {
      if (matchingOrg) {
        const agentId = await getAgentIdFromTenant();
        setOrgAgentId(agentId);
      } else {
        setOrgAgentId(null);
      }
    };

    getOrgAgentId();
  }, [matchingOrg]);

  const tenantName = matchingOrg?.['tenant-name'] ?? getTenantFromLocalStorage();

  return {
    orgAgentId,
    tenantName,
  };
};

export default usePlaygroundOptions;
