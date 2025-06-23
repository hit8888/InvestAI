import { motion } from 'framer-motion';
import NavLinkSingleItem from './NavLinkSingleItem';
import { cn } from '@breakout/design-system/lib/cn';
import PanelNavArrowLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-icon';
import PanelNavArrowLastLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-last-icon';
import useSidebarNavigationItems from '../../hooks/useSidebarNavigationItems/useSidebarNavigationItems';
import { getTransitionAnimation } from '../../utils/common';
import { useLocation } from 'react-router-dom';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import Typography from '@breakout/design-system/components/Typography/index';
import { useSidebar } from '../../context/SidebarContext';

type NavLinkItem = {
  navUrl: string;
  navItem: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  children?: NavLinkItem[];
};

const NavigationBodyItems = () => {
  const { isSidebarOpen: isOpen, sideNavView } = useSidebar();
  const location = useLocation();
  const { groupedItems, ungroupedItems, expandedTabs, handleTabExpansion } = useSidebarNavigationItems({
    sideNavView,
  });

  const getNavigationChildrenItems = (navItem: NavLinkItem) => {
    return (
      navItem.children &&
      expandedTabs[navItem.navItem] &&
      isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-col"
        >
          {navItem.children.map((child: NavLinkItem, index: number) => (
            <div key={child.navItem} className="flex w-full">
              {index === navItem.children!.length - 1 ? (
                <PanelNavArrowLastLiningIcon width="56" height="36" />
              ) : (
                <PanelNavArrowLiningIcon width={56} height={36} />
              )}
              <NavLinkSingleItem
                {...child}
                isChild
                isPanelOpen={isOpen}
                isActive={location.pathname.includes(child.navUrl)}
              />
            </div>
          ))}
        </motion.div>
      )
    );
  };

  const getTooltipContent = (navItem: NavLinkItem) => {
    return (
      <>
        {navItem.children && (
          <div className="flex w-full flex-col">
            {navItem.children?.map((child: NavLinkItem, index: number) => (
              <div key={child.navItem} className="flex w-full">
                <span className="-ml-6">
                  {index === (navItem.children?.length ?? 0) - 1 ? (
                    <PanelNavArrowLastLiningIcon height={36} />
                  ) : (
                    <PanelNavArrowLiningIcon height={36} />
                  )}
                </span>
                <NavLinkSingleItem
                  {...child}
                  isPanelOpen={true}
                  isChild={true}
                  isActive={location.pathname.includes(child.navUrl)}
                />
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  const showTooltip = (navItem: NavLinkItem) => !!navItem.children && !isOpen;

  const renderNavItem = (navItem: NavLinkItem) => (
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
            onClick={() => handleTabExpansion(navItem.navItem)}
            isExpanded={expandedTabs[navItem.navItem]}
            isActive={location.pathname.includes(navItem.navUrl)}
            hasChildren={!!navItem.children}
          />
        }
        showTooltip={showTooltip(navItem)}
        content={getTooltipContent(navItem)}
      />
      {getNavigationChildrenItems(navItem)}
    </div>
  );

  return (
    <motion.div
      className={cn('flex w-full flex-1 flex-col bg-primary/2.5', {
        'items-center gap-2': !isOpen,
        'items-start': isOpen,
      })}
      {...getTransitionAnimation()}
    >
      {/* Render ungrouped items first */}
      {ungroupedItems.length > 0 && (
        <div className={cn('flex w-full flex-col', { 'gap-2': !isOpen })}>{ungroupedItems.map(renderNavItem)}</div>
      )}

      {/* Render grouped items */}
      {Array.from(groupedItems.entries()).map(([groupName, groupItems]) => (
        <div key={groupName} className="w-full">
          {isOpen && (
            <Typography variant="caption-12-medium" className="bg-gray-100 px-4 py-2 text-gray-900">
              {groupName}
            </Typography>
          )}
          <div className={cn('flex flex-col', { 'gap-2': !isOpen })}>{groupItems.map(renderNavItem)}</div>
        </div>
      ))}
    </motion.div>
  );
};

export default NavigationBodyItems;
