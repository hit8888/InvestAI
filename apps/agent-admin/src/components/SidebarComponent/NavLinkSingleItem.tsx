import { cn } from '@breakout/design-system/lib/cn';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PanelChevronDownIcon from '@breakout/design-system/components/icons/panel-chevrondown-icon';
import PanelNavArrowLastLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-last-icon';
import PanelNavArrowLiningIcon from '@breakout/design-system/components/icons/panel-navarrow-lining-icon';
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import useAdminEventAnalytics from '@meaku/core/hooks/useAdminEventAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import Typography from '@breakout/design-system/components/Typography/index';
import { NavLinkItem } from '../../utils/admin-types';

type IProps = {
  navItem: NavLinkItem;
  options: {
    isPanelOpen: boolean;
    isChild: boolean;
    insideTooltip: boolean;
  };
};

export const NavigationItemWithChildren = ({ navItem, options }: IProps) => {
  const { isPanelOpen, isChild, insideTooltip } = options;
  if (!navItem.children) return null;

  return (
    <>
      {navItem.children?.map((child: NavLinkItem, index: number) => (
        <div key={child.navItem} className="flex w-full items-center gap-1">
          <span className={insideTooltip ? '-ml-6' : ''}>
            {index === navItem.children!.length - 1 ? (
              <PanelNavArrowLastLiningIcon className="shrink-0" width="56" height="44" />
            ) : (
              <PanelNavArrowLiningIcon className="shrink-0" width="56" height="44" />
            )}
          </span>
          <NavLinkSingleItem
            {...child}
            isChild={isChild}
            isPanelOpen={isPanelOpen}
            isActive={location.pathname.includes(child.navUrl)}
          />
        </div>
      ))}
    </>
  );
};

type NavLinkProps = {
  navUrl?: string;
  navItem: NavLinkItem | string;
  isActive: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  isPanelOpen: boolean;
  isChild?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
};

export const NavLinkSingleItem = ({
  navUrl = '',
  navItem,
  isActive,
  icon,
  activeIcon,
  isPanelOpen,
  isChild,
  hasChildren,
  isExpanded,
  onClick,
}: NavLinkProps) => {
  const { trackAdminEvent } = useAdminEventAnalytics();
  const IconComponent = isActive ? activeIcon : icon;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren || !navUrl) {
      e.preventDefault();
      onClick?.();
    }

    if (navItem) {
      trackAdminEvent(ANALYTICS_EVENT_NAMES.SIDE_NAV_ITEM_CLICKED, {
        itemName: navItem,
      });
    }
  };

  const getIcon = () => {
    return (
      <>
        {IconComponent && (
          <div
            className={cn(`flex items-center rounded-lg p-1`, {
              'bg-white': isActive,
              'bg-primary/10 group-hover:bg-white': !isActive,
            })}
          >
            <IconComponent {...COMMON_SMALL_ICON_PROPS} />
          </div>
        )}
      </>
    );
  };

  const getTooltipContent = (navItem: NavLinkItem) => {
    if (!navItem?.children?.length) {
      return (
        <Typography variant="label-16-medium">{typeof navItem === 'string' ? navItem : navItem.navItem}</Typography>
      );
    }
    return (
      <div className="flex h-full w-full flex-col">
        <NavigationItemWithChildren
          navItem={navItem}
          options={{ isPanelOpen: true, isChild: true, insideTooltip: true }}
        />
      </div>
    );
  };

  const getTooltipTrigger = () => {
    return (
      <NavLink
        to={navUrl}
        onClick={handleClick}
        className={cn(`flex cursor-pointer flex-col items-center`, {
          'w-full items-start p-2': isPanelOpen,
          'items-center justify-center p-0 pr-2': isChild,
        })}
      >
        <motion.div
          className={cn(`group flex items-center gap-2 rounded-lg p-2`, {
            'bg-primary/20': isActive,
            'hover:bg-primary/10': !isActive,
            'w-full': isPanelOpen,
            'justify-between': hasChildren,
            'p-1.5 pl-2': isChild,
          })}
        >
          <div className="flex items-center gap-2">
            {getIcon()}
            <AnimatePresence>
              <motion.span
                className={cn(`text-base transition-all duration-300`, {
                  'font-medium text-gray-900': isActive,
                  'text-gray-500': !isActive,
                  'w-auto': isPanelOpen,
                  'hidden opacity-0': !isPanelOpen,
                })}
              >
                {typeof navItem === 'string' ? navItem : navItem.navItem}
              </motion.span>
            </AnimatePresence>
          </div>
          {hasChildren && isPanelOpen ? (
            <PanelChevronDownIcon
              width="24"
              height="24"
              className={!isExpanded ? 'text-gray-900' : 'rotate-180 text-primary'}
            />
          ) : null}
        </motion.div>
      </NavLink>
    );
  };

  return (
    <div key={typeof navItem === 'string' ? navItem : navItem.navItem} className="w-full">
      <TooltipWrapperDark
        tooltipSide="bottom"
        tooltipAlign="start"
        tooltipSideOffsetValue={0}
        showArrow={false}
        tooltipContentClassName="!w-full !relative !top-1 !left-4 px-0 !bg-white !shadow-2xl"
        trigger={getTooltipTrigger()}
        showTooltip={!isPanelOpen}
        content={getTooltipContent(navItem as NavLinkItem)}
      />
    </div>
  );
};
