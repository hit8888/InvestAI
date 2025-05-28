import { motion } from 'framer-motion';
import NavLinkSingleItem from '../NavLinkSingleItem';
import { cn } from '@breakout/design-system/lib/cn';
import PanelNavArrowLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-icon';
import PanelNavArrowLastLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-last-icon';
import useSidebarNavigationItems from '../../hooks/useSidebarNavigationItems';
import { getTransitionAnimation } from '../../utils/common';

const NavigationBodyItems = ({ isOpen }: { isOpen: boolean }) => {
  const { NAV_LINK_ITEMS, isAgentExpanded, handleAgentTabExpansion } = useSidebarNavigationItems();

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
            onExpand={handleAgentTabExpansion}
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
