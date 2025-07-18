import CustomPageHeader from '../components/CustomPageHeader';
import withPageViewWrapper from '../pages/PageViewWrapper';
import PanelPlaygroundActiveIcon from '@breakout/design-system/components/icons/panel-playground-active-icon';
import { COMMON_SMALL_ICON_PROPS } from '../utils/constants';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import useChatAgentScript from '../hooks/useChatAgentScript';
import { getUserEmailFromLocalStorage } from '@meaku/core/utils/index';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getAgentIdFromTenant } from '../utils/apiCalls';
import { useEffect, useState } from 'react';

const PlaygroundPage = () => {
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
  const userEmail = getUserEmailFromLocalStorage() || '';

  useChatAgentScript(tenantName, userEmail, orgAgentId);

  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-1 self-stretch">
        <CustomPageHeader
          headerTitle="Playground"
          headerIcon={<PanelPlaygroundActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
        />
        <div className="relative z-10 h-[88vh] self-stretch">
          <div
            id="embedded-breakout-agent"
            className="relative flex h-full w-full flex-col items-start justify-start"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default withPageViewWrapper(PlaygroundPage);
