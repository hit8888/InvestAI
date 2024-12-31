import { cn } from '@breakout/design-system/lib/cn';

import { useAuth } from '../context/AuthProvider';
import useSidebarAndPageState from '../hooks/useSidebarAndPageState';
import ProfilePicActionButton from './ProfilePicActionButton';
import NavLinkSingleItem from './NavLinkSingleItem';
import {
  ADMIN_DASHBOARD_COMPANY_NAME,
  DEFAULT_USERNAME,
  NAV_LINK_ICON_PROPS,
  NAVITEM_CONVERSATIONS_PAGE,
  NAVITEM_LEADS_PAGE,
  NAVITEM_PLAYGROUND_PAGE,
  URL_ROUTE_CONVERSATIONS_PAGE,
  URL_ROUTE_LEADS_PAGE,
  URL_ROUTE_PLAYGROUND_PAGE,
} from '../utils/constants';

import Separator from '@breakout/design-system/components/layout/separator';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelPlaygroundIcon from '@breakout/design-system/components/icons/panel-playground-icon';
import PanelCloseIcon from '@breakout/design-system/components/icons/panel-close-icon';
import AdminLogoSVG from '@breakout/design-system/components/icons/admin-logo-icon';

const Sidebar: React.FC = () => {
  const {
    isSidebarOpen: isOpen,
    toggleSidebar,
    isLoginPage,
    isLeadsPage,
    isConversationsPage,
    isPlaygroundPage,
  } = useSidebarAndPageState();
  const { userInfo } = useAuth();

  if (isLoginPage) {
    return null;
  }

  const NAV_LINK_ITEMS = [
    {
      navUrl: URL_ROUTE_LEADS_PAGE,
      navItem: NAVITEM_LEADS_PAGE,
      navImg: <PanelLeadsIcon {...NAV_LINK_ICON_PROPS} />,
      isActive: isLeadsPage,
    },
    {
      navUrl: URL_ROUTE_CONVERSATIONS_PAGE,
      navItem: NAVITEM_CONVERSATIONS_PAGE,
      navImg: <PanelConversationIcon {...NAV_LINK_ICON_PROPS} />,
      isActive: isConversationsPage,
    },
    {
      navUrl: URL_ROUTE_PLAYGROUND_PAGE,
      navItem: NAVITEM_PLAYGROUND_PAGE,
      navImg: <PanelPlaygroundIcon {...NAV_LINK_ICON_PROPS} />,
      isActive: isPlaygroundPage,
    },
  ];

  const userName = userInfo?.username || DEFAULT_USERNAME;

  return (
    <div
      className={cn('flex flex-col items-start border-r border-[#EDECFB] 2xl:h-screen', {
        'w-[22%] 2xl:w-[15%]': isOpen,
        'w-[75px] 2xl:w-[4%]': !isOpen,
      })}
      style={{
        transition: 'width 0.3s',
      }}
    >
      <div
        className={`flex flex-shrink-0 flex-col items-start gap-4 self-stretch border border-[rgba(255,255,255,0.32)] bg-[#FBFBFE] px-2 pb-0 pt-4`}
      >
        <div
          className={cn(`flex w-full items-center justify-between gap-4 px-2`, {
            'flex-col': !isOpen,
          })}
        >
          <div className="flex items-center gap-2 pl-2">
            <AdminLogoSVG width={'30'} height={'35'} />
            {isOpen ? (
              <span className="text-base font-bold tracking-[-0.16px] text-[#599AD9] transition-all duration-300">
                {ADMIN_DASHBOARD_COMPANY_NAME}
              </span>
            ) : null}
          </div>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center gap-[10px] rounded-lg bg-[#FBFBFE] pt-2"
          >
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
      <div className="flex w-full flex-col items-start">
        {NAV_LINK_ITEMS.map((navItem) => (
          <NavLinkSingleItem key={navItem?.navItem} {...navItem} isPanelOpen={isOpen} />
        ))}
      </div>
      <div className="flex flex-1 flex-col items-start gap-4 self-stretch border border-[rgba(255,255,255,0.32)] bg-[#FBFBFE] px-2 py-4 pb-2">
        <div className="flex flex-1 flex-col items-start justify-end gap-2 self-stretch">
          <Separator />
          <div className="flex flex-col items-start justify-center gap-2 self-stretch rounded-2xl p-2">
            <div
              className={cn(`flex items-center gap-2 self-stretch transition-all duration-300`, {
                'flex-col': !isOpen,
              })}
            >
              <div className="flex flex-1 items-center gap-[10px]">
                <ProfilePicActionButton />
                {isOpen ? (
                  <div className="flex w-full flex-col items-start justify-center gap-0.5">
                    <p className="w-[90%] truncate text-sm font-semibold text-[#4E46DC]">{userName}</p>
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
