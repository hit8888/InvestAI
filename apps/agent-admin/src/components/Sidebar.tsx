import { cn } from '@breakout/design-system/lib/cn';

import { useAuth } from '../context/AuthProvider';
import { useSidebar } from '../context/SidebarContext';

import usePageRouteState from '../hooks/usePageRouteState';
import ProfilePicActionButton from './ProfilePicActionButton';
import NavLinkSingleItem from './NavLinkSingleItem';
import {
  ADMIN_DASHBOARD_COMPANY_NAME,
  DEFAULT_USERNAME,
  COMMON_SMALL_ICON_PROPS,
  AppRoutesEnum,
  SidebarNavItemsEnum,
} from '../utils/constants';

import Separator from '@breakout/design-system/components/layout/separator';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
// import PanelPlaygroundIcon from '@breakout/design-system/components/icons/panel-playground-icon';
import PanelCloseIcon from '@breakout/design-system/components/icons/panel-close-icon';
import AdminLogoSVG from '@breakout/design-system/components/icons/admin-logo-icon';
import { getTenantIdentifier } from '@meaku/core/utils/index';

const Sidebar: React.FC = () => {
  const {
    isLoginPage,
    isLeadsPage,
    isConversationsPage,
    // isPlaygroundPage
  } = usePageRouteState();
  const { isSidebarOpen: isOpen, toggleSidebar } = useSidebar();
  const { userInfo } = useAuth();

  const {
    LEADS,
    CONVERSATIONS,
    // PLAYGROUND
  } = AppRoutesEnum;
  const {
    LEADS_LABEL,
    CONVERSATIONS_LABEL,
    // PLAYGROUND_LABEL
  } = SidebarNavItemsEnum;

  if (isLoginPage) {
    return null;
  }

  const NAV_LINK_ITEMS = [
    {
      navUrl: LEADS,
      navItem: LEADS_LABEL,
      navImg: <PanelLeadsIcon {...COMMON_SMALL_ICON_PROPS} />,
      isActive: isLeadsPage,
    },
    {
      navUrl: CONVERSATIONS,
      navItem: CONVERSATIONS_LABEL,
      navImg: <PanelConversationIcon {...COMMON_SMALL_ICON_PROPS} />,
      isActive: isConversationsPage,
    },
    // {
    //   navUrl: PLAYGROUND,
    //   navItem: PLAYGROUND_LABEL,
    //   navImg: <PanelPlaygroundIcon {...COMMON_SMALL_ICON_PROPS} />,
    //   isActive: isPlaygroundPage,
    // },
  ];

  const userName = userInfo?.username || DEFAULT_USERNAME;
  const orgList = userInfo?.organizations;
  const isUserSuperAdmin = (orgList?.length ?? 0) > 1 && orgList?.every((org) => org?.role === 'admin');

  const TENANT_NAME = getTenantIdentifier()?.['name'] ?? ADMIN_DASHBOARD_COMPANY_NAME;
  const TENANT_LOGO_URL = getTenantIdentifier()?.['logo'] ?? '';
  const isTenantLogoUrlPresent = TENANT_LOGO_URL.length > 0;

  const Container = isUserSuperAdmin ? 'a' : 'div';
  const containerProps = isUserSuperAdmin ? { href: '/' } : {};

  return (
    <div
      className={cn('sticky top-0 z-50 flex h-screen flex-col items-start border-r border-primary/10', {
        'w-72 2xl:w-[15%]': isOpen,
        'w-20 2xl:w-[4%]': !isOpen,
      })}
      style={{
        transition: 'width 0.3s',
      }}
    >
      <div
        className={`flex flex-shrink-0 flex-col items-start gap-4 self-stretch border border-[rgb(var(--primary-foreground)/0.32)] px-2 pb-0 pt-4`}
      >
        <div
          className={cn(`flex w-full items-center justify-between px-2 pb-2`, {
            'flex-col': !isOpen,
          })}
        >
          <div
            className={cn('flex items-center gap-2', {
              'w-full justify-center': isTenantLogoUrlPresent,
            })}
          >
            <Container
              {...containerProps}
              className={cn('flex h-12 w-full items-center', {
                'justify-center': isOpen && isTenantLogoUrlPresent,
              })}
            >
              {isTenantLogoUrlPresent ? (
                <img className="h-full w-full object-contain" src={TENANT_LOGO_URL} alt={`${TENANT_NAME} logo`} />
              ) : (
                <AdminLogoSVG width={'30'} height={'35'} />
              )}
            </Container>
            {isOpen && !isTenantLogoUrlPresent ? (
              <span className="text-lg font-bold text-gray-900 transition-all duration-300">{TENANT_NAME}</span>
            ) : null}
          </div>
        </div>
        <div className="relative w-full">
          <button
            onClick={toggleSidebar}
            className="absolute -right-6 -top-4 z-50 flex h-7 w-7 items-center justify-center  rounded-lg border border-white/50 bg-primary "
          >
            <PanelCloseIcon
              {...COMMON_SMALL_ICON_PROPS}
              color="#fff"
              className={cn(`z-50 h-4 w-4 transition-transform duration-300 `, {
                'rotate-0': isOpen,
                'rotate-180': !isOpen,
              })}
            />
          </button>
          <Separator className="w-[95%]" />
        </div>
      </div>
      <div className="flex w-full flex-col items-start bg-primary/2.5 pt-4">
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
