import { motion } from 'framer-motion';
import NavLinkSingleItem from '../NavLinkSingleItem';
import { cn } from '@breakout/design-system/lib/cn';
import { AppRoutesEnum, COMMON_SMALL_ICON_PROPS, SidebarNavItemsEnum } from '../../utils/constants';
import PanelLeadsIcon from '@breakout/design-system/components/icons/panel-leads-icon';
import PanelLeadsActiveIcon from '@breakout/design-system/components/icons/panel-leads-active-icon';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelAgentActiveIcon from '@breakout/design-system/components/icons/panel-agent-active-icon';
import PanelAgentIcon from '@breakout/design-system/components/icons/panel-agent-icon';
import PanelNavArrowLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-icon';
import PanelNavArrowLastLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-last-icon';
import usePageRouteState from '../../hooks/usePageRouteState';
import { getDashboardBasicPathURL, getTransitionAnimation } from '../../utils/common';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const NavigationBodyItems = ({ isOpen }: { isOpen: boolean }) => {
  const [isAgentExpanded, setIsAgentExpanded] = useState(false);
  const { tenantName } = useParams();
  const {
    isLeadsPage,
    isConversationsPage,
    isAgentPlaygroundPage,
    isAgentBrandingPage,
    isAgentEntrypointsPage,
    isAgentInstructionsPage,
  } = usePageRouteState();
  const { LEADS, CONVERSATIONS, AGENT, AGENT_PLAYGROUND, AGENT_BRANDING, AGENT_ENTRYPOINTS, AGENT_INSTRUCTIONS } =
    AppRoutesEnum;
  const {
    LEADS_LABEL,
    CONVERSATIONS_LABEL,
    AGENT_LABEL,
    AGENT_PLAYGROUND_LABEL,
    AGENT_BRANDING_LABEL,
    AGENT_ENTRYPOINTS_LABEL,
    AGENT_INSTRUCTIONS_LABEL,
  } = SidebarNavItemsEnum;

  const basicURL = getDashboardBasicPathURL(tenantName ?? '');

  const NAV_LINK_ITEMS = [
    {
      navUrl: `${basicURL}/${LEADS}`,
      navItem: LEADS_LABEL,
      navImg: isLeadsPage ? (
        <PanelLeadsActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelLeadsIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isLeadsPage,
    },
    {
      navUrl: `${basicURL}/${CONVERSATIONS}`,
      navItem: CONVERSATIONS_LABEL,
      navImg: isConversationsPage ? (
        <PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />
      ) : (
        <PanelConversationIcon {...COMMON_SMALL_ICON_PROPS} />
      ),
      isActive: isConversationsPage,
    },
    {
      navUrl: `${basicURL}/${AGENT}`,
      navItem: AGENT_LABEL,
      navImg:
        isAgentPlaygroundPage || isAgentBrandingPage || isAgentEntrypointsPage || isAgentInstructionsPage ? (
          <PanelAgentActiveIcon {...COMMON_SMALL_ICON_PROPS} />
        ) : (
          <PanelAgentIcon {...COMMON_SMALL_ICON_PROPS} />
        ),
      isActive: isAgentPlaygroundPage || isAgentBrandingPage || isAgentEntrypointsPage || isAgentInstructionsPage,
      hasChildren: true,
      children: [
        {
          navUrl: `${basicURL}/${AGENT_PLAYGROUND}`,
          navItem: AGENT_PLAYGROUND_LABEL,
          isActive: isAgentPlaygroundPage,
        },
        {
          navUrl: `${basicURL}/${AGENT_BRANDING}`,
          navItem: AGENT_BRANDING_LABEL,
          isActive: isAgentBrandingPage,
        },
        {
          navUrl: `${basicURL}/${AGENT_ENTRYPOINTS}`,
          navItem: AGENT_ENTRYPOINTS_LABEL,
          isActive: isAgentEntrypointsPage,
        },
        {
          navUrl: `${basicURL}/${AGENT_INSTRUCTIONS}`,
          navItem: AGENT_INSTRUCTIONS_LABEL,
          isActive: isAgentInstructionsPage,
        },
      ],
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
        <div key={navItem.navItem} className="w-full">
          <NavLinkSingleItem
            {...navItem}
            isPanelOpen={isOpen}
            onExpand={() => setIsAgentExpanded(!isAgentExpanded)}
            isExpanded={isAgentExpanded}
          />
          {navItem.hasChildren && isAgentExpanded && isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col"
            >
              {navItem.children?.map((child, index) => (
                <div key={child.navItem} className="flex w-full">
                  {index === navItem.children.length - 1 ? (
                    <PanelNavArrowLastLiningIcon width="56" height="36" />
                  ) : (
                    <PanelNavArrowLiningIcon width={56} height={36} />
                  )}
                  <NavLinkSingleItem {...child} isPanelOpen={isOpen} isChild={true} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default NavigationBodyItems;
