import CustomPageHeader from '../components/CustomPageHeader';
import withPageViewWrapper from '../pages/PageViewWrapper';
import PanelPlaygroundActiveIcon from '@breakout/design-system/components/icons/panel-playground-active-icon';
import { COMMON_SMALL_ICON_PROPS } from '../utils/constants';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { getUserEmailFromLocalStorage } from '@meaku/core/utils/index';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getAgentIdFromTenant } from '../utils/apiCalls';
import { useEffect, useState } from 'react';

const AGENT_BASE_URL = import.meta.env.VITE_AGENT_BASE_URL;
const AGENT_STG_BASE_URL = import.meta.env.VITE_AGENT_STG_BASE_URL;
const APP_ENV = import.meta.env.VITE_APP_ENV;

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

  const isStaging = APP_ENV !== 'production';

  const agentBaseUrl = isStaging ? AGENT_STG_BASE_URL : AGENT_BASE_URL;

  // REMINDER: This is for testing purposes only. Comment above line and uncomment below line.
  // const agentBaseUrl = 'http://localhost:5173';

  const iframeSrc = `${agentBaseUrl}/demo/org/${tenantName}/agent/${orgAgentId}/?bc=true&email=${userEmail}&container_id=embedded-breakout-agent`;

  return (
    <>
      <CustomPageHeader
        headerTitle="Playground"
        headerIcon={<PanelPlaygroundActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
      />
      <div className="relative z-10 -mt-4 h-[90vh] self-stretch">
        <div id="embedded-breakout-agent" className="relative flex h-full w-full flex-col items-start justify-start">
          <iframe height={'100%'} width={'100%'} src={iframeSrc} />
        </div>
      </div>
    </>
  );
};

export default withPageViewWrapper(PlaygroundPage);
