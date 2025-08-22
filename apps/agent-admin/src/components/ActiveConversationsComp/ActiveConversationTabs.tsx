import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';
import { Pin, MessageSquareText, User } from 'lucide-react';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { AppRoutesEnum } from '../../utils/constants';

type TabConfig = {
  path: string;
  label: string;
  icon: React.ElementType;
};

const tabs: TabConfig[] = [
  {
    path: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/assigned`,
    label: 'Assigned',
    icon: User,
  },
  {
    path: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}`,
    label: 'All Conversations',
    icon: MessageSquareText,
  },
  {
    path: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/pinned`,
    label: 'Pinned Conversations',
    icon: Pin,
  },
];

const ActiveConversationTabs = ({ hasPinnedConversations }: { hasPinnedConversations: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tenantName = getTenantFromLocalStorage();

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
          <button
            key={path}
            onClick={() => handleTabClick(path)}
            className={cn(
              'flex items-center gap-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              isActive ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-primary',
            )}
          >
            <Icon
              className={cn('rounded-full p-1 transition-colors', {
                'fill-current text-primary':
                  hasPinnedConversations && path === `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}/pinned`,
              })}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ActiveConversationTabs;
