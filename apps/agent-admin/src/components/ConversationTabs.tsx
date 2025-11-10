import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';
import { AppRoutesEnum } from '../utils/constants';
import SingleTabDisplay from './ConversationDetailsComp/SingleTabDisplay';
import LinkClicksIcon from '@breakout/design-system/components/icons/link-clicks-icon';
import ActiveLeadsIcon from '@breakout/design-system/components/icons/active-leads-icon';
import AllConversationsIcon from '@breakout/design-system/components/icons/all-conversations-icon';
import { useSessionStore } from '../stores/useSessionStore';

type TabConfig = {
  path: string;
  label: string;
  icon: React.ElementType;
};

export const CONVERSATION_TABS: TabConfig[] = [
  {
    path: `/${AppRoutesEnum.CONVERSATIONS}`,
    label: 'All Visitors',
    icon: AllConversationsIcon,
  },
  {
    path: `/${AppRoutesEnum.ACTIVE_LEADS}`,
    label: 'Breakout Captured Leads',
    icon: ActiveLeadsIcon,
  },
  {
    path: `/${AppRoutesEnum.LINK_CLICKS}`,
    label: 'Non Captured Leads',
    icon: LinkClicksIcon,
  },
];

export const isTabActive = (tabPath: string, pathname: string, tenantName: string | null | undefined) => {
  const normalizedPath = tenantName ? pathname.replace(`/${tenantName}`, '') : pathname;
  if (normalizedPath === '/') return tabPath === `/${AppRoutesEnum.CONVERSATIONS}`;

  // For main conversations tab, ensure we're not in a sub-section
  if (tabPath === `/${AppRoutesEnum.CONVERSATIONS}`) {
    return (
      normalizedPath === `/${AppRoutesEnum.CONVERSATIONS}` ||
      (normalizedPath.startsWith(`/${AppRoutesEnum.CONVERSATIONS}/`) &&
        !normalizedPath.includes('/leads') &&
        !normalizedPath.includes('/link-clicks'))
    );
  }

  return normalizedPath.includes(tabPath);
};

const ConversationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const handleTabClick = (path: string) => {
    const basePath = tenantName ? `/${tenantName}${path}` : path;
    navigate(basePath);
  };

  return (
    <div className="sticky top-0 z-10 flex items-start self-stretch border-b border-primary/10 bg-white pt-4">
      {CONVERSATION_TABS.map(({ path, label, icon: Icon }) => {
        const isActive = isTabActive(path, location.pathname, tenantName);
        return (
          <SingleTabDisplay
            key={path}
            handleTabClick={() => handleTabClick(path)}
            tabLabel={label}
            isTabSelected={isActive}
          >
            <Icon
              width="16"
              height="16"
              className={cn({
                'text-white': isActive,
                'text-primary': !isActive,
              })}
            />
          </SingleTabDisplay>
        );
      })}
    </div>
  );
};

export default ConversationTabs;
