import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';
import { MessageSquareText } from 'lucide-react';
// import { Pin, User } from 'lucide-react';
import { AppRoutesEnum } from '../../utils/constants';
import SingleTabDisplay from '../ConversationDetailsComp/SingleTabDisplay';
import { useSessionStore } from '../../stores/useSessionStore';

type TabConfig = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const tabs: TabConfig[] = [
  // {
  //   path: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/assigned`,
  //   label: 'Assigned',
  //   icon: User,
  // },
  {
    path: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}`,
    label: 'All Conversations',
    icon: MessageSquareText,
  },
  // {
  //   path: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/pinned`,
  //   label: 'Pinned Conversations',
  //   icon: Pin,
  // },
];

const ActiveConversationTabs = ({ hasPinnedConversations }: { hasPinnedConversations: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const handleTabClick = (path: string) => {
    const basePath = tenantName ? `/${tenantName}${path}` : path;
    navigate(basePath);
  };

  const isTabActive = (tabPath: string) => {
    const normalizedPath = tenantName ? location.pathname.replace(`/${tenantName}`, '') : location.pathname;

    // For main active conversations tab, ensure we're not in a sub-section
    if (tabPath === `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}`) {
      return (
        normalizedPath === `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}` ||
        (normalizedPath.startsWith(`/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/`) &&
          !normalizedPath.includes('/assigned') &&
          !normalizedPath.includes('/pinned'))
      );
    }

    return normalizedPath.includes(tabPath);
  };

  return (
    <div className="mb-4 flex items-start self-stretch border-b border-gray-200 bg-white">
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
                'text-white': isActive,
                'text-primary': hasPinnedConversations && path === `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/pinned`,
              })}
            />
          </SingleTabDisplay>
        );
      })}
    </div>
  );
};

export default ActiveConversationTabs;
