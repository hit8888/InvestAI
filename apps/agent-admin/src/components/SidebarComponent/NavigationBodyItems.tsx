import React from 'react';
import { motion } from 'framer-motion';
import { NavLinkSingleItem, NavigationItemWithChildren } from './NavLinkSingleItem';
import { cn } from '@breakout/design-system/lib/cn';
import { getTransitionAnimation } from '../../utils/common';
import { useLocation } from 'react-router-dom';
import Typography from '@breakout/design-system/components/Typography/index';
import { useSidebar } from '../../context/SidebarContext';

type NavLinkItem = {
  navUrl: string;
  navItem: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavLinkItem[];
};

const NavigationBodyItems = () => {
  const { isSidebarOpen: isOpen, groupedItems, ungroupedItems, expandedTabs, handleTabExpansion } = useSidebar();
  const location = useLocation();

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
          <NavigationItemWithChildren
            navItem={navItem}
            options={{ isPanelOpen: isOpen, isChild: true, insideTooltip: false }}
          />
        </motion.div>
      )
    );
  };

  const renderNavItem = (navItem: NavLinkItem) => (
    <React.Fragment key={navItem.navItem}>
      <NavLinkSingleItem
        {...navItem}
        navItem={navItem}
        isPanelOpen={isOpen}
        onClick={() => handleTabExpansion(navItem.navItem)}
        isExpanded={expandedTabs[navItem.navItem]}
        isActive={location.pathname.includes(navItem.navUrl)}
        hasChildren={!!navItem.children}
      />
      {getNavigationChildrenItems(navItem)}
    </React.Fragment>
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
        <div className={cn('flex w-full flex-col pl-2', { 'gap-2': !isOpen })}>{ungroupedItems.map(renderNavItem)}</div>
      )}

      {/* Render grouped items */}
      {Array.from(groupedItems.entries()).map(([groupName, groupItems]) => (
        <div key={groupName} className="flex w-full flex-col gap-2">
          {isOpen && (
            <Typography variant="caption-12-medium" className="bg-gray-100 px-4 py-2 text-gray-900">
              {groupName}
            </Typography>
          )}
          <div className={cn('flex flex-col pl-2', { 'gap-2': !isOpen })}>{groupItems.map(renderNavItem)}</div>
        </div>
      ))}
    </motion.div>
  );
};

export default NavigationBodyItems;
