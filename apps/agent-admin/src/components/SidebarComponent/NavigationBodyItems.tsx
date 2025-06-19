import { motion } from 'framer-motion';
import NavLinkSingleItem from '../NavLinkSingleItem';
import { cn } from '@breakout/design-system/lib/cn';
import PanelNavArrowLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-icon';
import PanelNavArrowLastLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-last-icon';
import useSidebarNavigationItems from '../../hooks/useSidebarNavigationItems';
import { getTransitionAnimation } from '../../utils/common';
import { NavLinkItemsType, NavItemChildrenType } from '../../utils/admin-types';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';

const NavigationBodyItems = ({ isOpen }: { isOpen: boolean }) => {
  const { NAV_LINK_ITEMS, expandedTabs, handleTabExpansion } = useSidebarNavigationItems();

  const getNavigationChildrenItems = (navItem: NavLinkItemsType) => {
    return (
      <>
        {navItem.hasChildren && expandedTabs[navItem.navItem] && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col"
          >
            {navItem.children?.map((child: NavItemChildrenType, index: number) => (
              <div key={child.navItem} className="flex w-full">
                {index === (navItem.children?.length ?? 0) - 1 ? (
                  <PanelNavArrowLastLiningIcon width="56" height="36" />
                ) : (
                  <PanelNavArrowLiningIcon width={56} height={36} />
                )}
                <NavLinkSingleItem {...child} isPanelOpen={isOpen} isChild={true} />
              </div>
            ))}
          </motion.div>
        )}
      </>
    );
  };

  const getTooltipContent = (navItem: NavLinkItemsType) => {
    return (
      <>
        {navItem.hasChildren && (
          <div className="flex w-full flex-col">
            {navItem.children?.map((child: NavItemChildrenType, index: number) => (
              <div key={child.navItem} className="flex w-full">
                <span className="-ml-6">
                  {index === (navItem.children?.length ?? 0) - 1 ? (
                    <PanelNavArrowLastLiningIcon height={36} />
                  ) : (
                    <PanelNavArrowLiningIcon height={36} />
                  )}
                </span>
                <NavLinkSingleItem {...child} isPanelOpen={true} isChild={true} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  const showTooltip = (navItem: NavLinkItemsType) => !!navItem.hasChildren && !isOpen;

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
          <TooltipWrapperDark
            tooltipSide="bottom"
            tooltipAlign="start"
            showArrow={false}
            tooltipContentClassName="!w-full !relative !top-1 !left-4 px-0 !bg-white !shadow-2xl"
            trigger={
              <NavLinkSingleItem
                {...navItem}
                isPanelOpen={isOpen}
                onExpand={() => handleTabExpansion(navItem.navItem)}
                isExpanded={expandedTabs[navItem.navItem]}
              />
            }
            showTooltip={showTooltip(navItem)}
            content={getTooltipContent(navItem)}
          />
          {getNavigationChildrenItems(navItem)}
        </div>
      ))}
    </motion.div>
  );
};

export default NavigationBodyItems;
