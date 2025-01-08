import { cn } from '@breakout/design-system/lib/cn';

import { useAuth } from '../context/AuthProvider';
import { useSidebar } from '../context/SidebarContext';

import usePageRouteState from '../hooks/usePageRouteState';
import ProfilePicActionButton from './ProfilePicActionButton';
import NavLinkSingleItem from './NavLinkSingleItem';
import {
  ADMIN_DASHBOARD_COMPANY_NAME,
  DEFAULT_USERNAME,
  NAV_LINK_ICON_PROPS,
  AppRoutesEnum,
  SidebarNavItemsEnum,
} from '../utils/constants';

import Separator from '@breakout/design-system/components/layout/separator';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelPlaygroundIcon from '@breakout/design-system/components/icons/panel-playground-icon';
import PanelCloseIcon from '@breakout/design-system/components/icons/panel-close-icon';
import AdminLogoSVG from '@breakout/design-system/components/icons/admin-logo-icon';

const Sidebar: React.FC = () => {
  const { isLoginPage, isLeadsPage, isConversationsPage, isPlaygroundPage } = usePageRouteState();
  const { isSidebarOpen: isOpen, toggleSidebar } = useSidebar();
  const { userInfo, getTenantIdentifier } = useAuth();

  const { LEADS, CONVERSATIONS, PLAYGROUND } = AppRoutesEnum;
  const { LEADS_LABEL, CONVERSATIONS_LABEL, PLAYGROUND_LABEL } = SidebarNavItemsEnum;

  if (isLoginPage) {
    return null;
  }

  const NAV_LINK_ITEMS = [
    {
      navUrl: LEADS,
      navItem: LEADS_LABEL,
      navImg: <PanelLeadsIcon {...NAV_LINK_ICON_PROPS} />,
      isActive: isLeadsPage,
    },
    {
      navUrl: CONVERSATIONS,
      navItem: CONVERSATIONS_LABEL,
      navImg: <PanelConversationIcon {...NAV_LINK_ICON_PROPS} />,
      isActive: isConversationsPage,
    },
    {
      navUrl: PLAYGROUND,
      navItem: PLAYGROUND_LABEL,
      navImg: <PanelPlaygroundIcon {...NAV_LINK_ICON_PROPS} />,
      isActive: isPlaygroundPage,
    },
  ];

  const userName = userInfo?.username || DEFAULT_USERNAME;
  const TENANT_NAME = getTenantIdentifier()?.['name'] ?? ADMIN_DASHBOARD_COMPANY_NAME;

  return (
    <div
      className={cn('flex flex-col items-start border-r border-primary/10 2xl:h-screen', {
        'w-[22%] 2xl:w-[15%]': isOpen,
        'w-20 2xl:w-[4%]': !isOpen,
      })}
      style={{
        transition: 'width 0.3s',
      }}
    >
      <div
        className={`flex flex-shrink-0 flex-col items-start gap-4 self-stretch border border-[rgb(var(--primary-foreground)/0.32)] bg-primary/2.5 px-2 pb-0 pt-4`}
      >
        <div
          className={cn(`flex w-full items-center justify-between px-2`, {
            'flex-col': !isOpen,
          })}
        >
          <div className="flex items-center gap-2">
            <span className="h-8 w-8">
              <AdminLogoSVG width={'30'} height={'35'} />
            </span>
            {isOpen ? (
              <span className="text-base font-bold text-adminLogoText transition-all duration-300">{TENANT_NAME}</span>
            ) : null}
          </div>
          <button onClick={toggleSidebar} className="flex items-center justify-center rounded-lg pt-2">
            <PanelCloseIcon
              {...NAV_LINK_ICON_PROPS}
              className={cn(`h-8 w-8 transition-transform duration-300 `, {
                'rotate-0': isOpen,
                'rotate-180': !isOpen,
              })}
            />
          </button>
        </div>
        <Separator className="px-8" />
      </div>
      <div className="flex w-full flex-col items-start bg-primary/2.5">
        {NAV_LINK_ITEMS.map((navItem) => (
          <NavLinkSingleItem key={navItem?.navItem} {...navItem} isPanelOpen={isOpen} />
        ))}
      </div>
      <div className="flex flex-1 flex-col items-start gap-4 self-stretch border border-[rgb(var(--primary-foreground)/0.32)] bg-primary/2.5 px-2 py-4 pb-2">
        <div className="flex flex-1 flex-col items-start justify-end gap-2 self-stretch">
          <Separator />
          <div className="flex flex-col items-start justify-center gap-2 self-stretch rounded-2xl p-2">
            <div
              className={cn(`flex items-center gap-2 self-stretch transition-all duration-300`, {
                'flex-col': !isOpen,
              })}
            >
              <div className="flex flex-1 items-center gap-3">
                <ProfilePicActionButton />
                {isOpen ? (
                  <div className="flex w-full flex-col items-start justify-center gap-0.5">
                    <p className="w-[90%] truncate text-sm font-semibold text-primary">{userName}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
