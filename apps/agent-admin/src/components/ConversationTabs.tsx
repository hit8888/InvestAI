import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { AppRoutesEnum } from '../utils/constants';
import SingleTabDisplay from './ConversationDetailsComp/SingleTabDisplay';
import LinkClicksIcon from '@breakout/design-system/components/icons/link-clicks-icon';
import ActiveLeadsIcon from '@breakout/design-system/components/icons/active-leads-icon';
import AllConversationsIcon from '@breakout/design-system/components/icons/all-conversations-icon';

type TabConfig = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const tabs: TabConfig[] = [
  {
    path: `/${AppRoutesEnum.CONVERSATIONS}`,
    label: 'All Conversations',
    icon: AllConversationsIcon,
  },
  {
    path: `/${AppRoutesEnum.ACTIVE_LEADS}`,
    label: 'Active Leads',
    icon: ActiveLeadsIcon,
  },
  {
    path: `/${AppRoutesEnum.LINK_CLICKS}`,
    label: 'High Interest',
    icon: LinkClicksIcon,
  },
];

const ConversationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = getTenantFromLocalStorage();

  const handleTabClick = (path: string) => {
    const basePath = tenantName ? `/${tenantName}${path}` : path;
    navigate(basePath);
  };

  const isTabActive = (tabPath: string) => {
    const normalizedPath = tenantName ? location.pathname.replace(`/${tenantName}`, '') : location.pathname;
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

  return (
    <div className={cn('flex items-start self-stretch border-b border-primary/10')}>
      {tabs.map(({ path, label, icon: Icon }) => {
        const isActive = isTabActive(path);
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
                'text-primary': isActive,
                'text-primary/60': !isActive,
              })}
            />
          </SingleTabDisplay>
        );
      })}
    </div>
  );
};

export default ConversationTabs;
