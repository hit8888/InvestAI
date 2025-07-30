import withPageViewWrapper from '../pages/PageViewWrapper';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { getUserEmailFromLocalStorage } from '@meaku/core/utils/index';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getAgentIdFromTenant } from '../utils/apiCalls';
import { useEffect, useState } from 'react';
import Typography from '@breakout/design-system/components/Typography/index';
import { PlaygroundView } from '@meaku/core/types/common';
import { cn } from '@breakout/design-system/lib/cn';
import CustomTabs from '../components/CustomTabs';
import { PLAYGROUND_VIEW_TAB_ITEMS } from '../utils/constants';

const AGENT_BASE_URL = import.meta.env.VITE_AGENT_BASE_URL;
const PLAYGROUND_VIEW_KEY = 'playground_view_key';

const getInitialPlaygroundView = (): PlaygroundView => {
  const storedValue = localStorage.getItem(PLAYGROUND_VIEW_KEY);
  return storedValue ? JSON.parse(storedValue) : PlaygroundView.ADMIN_VIEW;
};

const PlaygroundPage = () => {
  const { tenantName: tenantNameParam } = useParams();
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const matchingOrg = orgList?.find((org) => org['tenant-name'] === tenantNameParam);

  const [orgAgentId, setOrgAgentId] = useState<number | null>(null);
  const [view, setView] = useState(getInitialPlaygroundView);

  const handlePlaygroundViewChange = (value: string) => {
    setView(value as PlaygroundView);
    localStorage.setItem(PLAYGROUND_VIEW_KEY, JSON.stringify(value));
  };

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

  // REMINDER: This is for testing purposes only. Comment above line and uncomment below line.
  // let agentBaseUrl = 'http://localhost:5174';
  let agentBaseUrl = AGENT_BASE_URL;
  if (view === PlaygroundView.ADMIN_VIEW) {
    agentBaseUrl = `${agentBaseUrl}/demo`;
  }

  const isUserView = view === PlaygroundView.USER_PREVIEW;

  const iframeSrc = `${agentBaseUrl}/org/${tenantName}/agent/${orgAgentId}/?bc=true&email=${userEmail}&container_id=embedded-breakout-agent&isAgentOpen=true&view=${view}`;

  return (
    <>
      <div className={cn('flex w-full items-center gap-4 self-stretch px-3', isUserView && 'px-0')}>
        <Typography variant="title-18" className="flex-1">
          Playground
        </Typography>
        <CustomTabs
          selectedTab={view}
          handleTabChange={handlePlaygroundViewChange}
          tabItems={PLAYGROUND_VIEW_TAB_ITEMS}
          tabContainerClassName="p-1"
        />
      </div>
      <div className="relative z-10 h-[88vh] self-stretch">
        <div id="embedded-breakout-agent" className="relative flex h-full w-full flex-col items-start justify-start">
          <iframe height={'100%'} width={'100%'} src={iframeSrc} />
        </div>
      </div>
    </>
  );
};

export default withPageViewWrapper(PlaygroundPage);
