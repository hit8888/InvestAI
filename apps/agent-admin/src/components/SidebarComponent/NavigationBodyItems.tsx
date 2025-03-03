import { motion } from 'framer-motion';
import NavLinkSingleItem from '../NavLinkSingleItem';
import { cn } from '@breakout/design-system/lib/cn';
import { AppRoutesEnum, COMMON_SMALL_ICON_PROPS, SidebarNavItemsEnum } from '../../utils/constants';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelLeadsActiveIcon from '@breakout/design-system/components/icons/panel-leads-active-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelPlaygroundIcon from '@breakout/design-system/components/icons/panel-playground-icon';
import PanelPlaygroundActiveIcon from '@breakout/design-system/components/icons/panel-playground-active-icon';
import usePageRouteState from '../../hooks/usePageRouteState';
import { getTransitionAnimation } from '../../utils/common';

const NavigationBodyItems = ({ isOpen }: { isOpen: boolean }) => {
  const { isLeadsPage, isConversationsPage, isPlaygroundPage } = usePageRouteState();
  const { LEADS, CONVERSATIONS, PLAYGROUND } = AppRoutesEnum;
  const { LEADS_LABEL, CONVERSATIONS_LABEL, PLAYGROUND_LABEL } = SidebarNavItemsEnum;
  const NAV_LINK_ITEMS = [
    {
      navUrl: LEADS,
      navItem: LEADS_LABEL,
      navImg: isLeadsPage ? (
        <PanelLeadsActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelLeadsIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isLeadsPage,
    },
    {
      navUrl: CONVERSATIONS,
      navItem: CONVERSATIONS_LABEL,
      navImg: isConversationsPage ? (
        <PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelConversationIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isConversationsPage,
    },
    {
      navUrl: PLAYGROUND,
      navItem: PLAYGROUND_LABEL,
      navImg: isPlaygroundPage ? (
        <PanelPlaygroundActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelPlaygroundIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isPlaygroundPage,
    },
  ];
  return (
    <motion.div
      className={cn('flex w-full flex-col bg-primary/2.5 pt-4', {
        'items-center gap-2': !isOpen,
        'items-start': isOpen,
      })}
      {...getTransitionAnimation()}
    >
      {NAV_LINK_ITEMS.map((navItem) => (
        <NavLinkSingleItem key={navItem?.navItem} {...navItem} isPanelOpen={isOpen} />
      ))}
    </motion.div>
  );
};

export default NavigationBodyItems;
