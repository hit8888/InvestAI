import { useSessionStore } from '../stores/useSessionStore';
import { getAgentIdFromTenant } from '../utils/apiCalls';
import { useEffect, useState } from 'react';

const usePlaygroundOptions = () => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';
  const userInfo = useSessionStore((state) => state.userInfo);
  const activeTenant = useSessionStore((state) => state.activeTenant);
  const orgList = userInfo?.organizations;
  const matchingOrg = orgList?.find((org) => org['tenant-name'] === tenantName);

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

  const finalTenantName = matchingOrg?.['tenant-name'] ?? activeTenant?.['tenant-name'];

  return {
    orgAgentId,
    tenantName: finalTenantName,
  };
};

export default usePlaygroundOptions;
