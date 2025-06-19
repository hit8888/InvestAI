import { cn } from '@breakout/design-system/lib/cn';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PanelChevronDownIcon from '@breakout/design-system/components/icons/panel-chevrondown-icon';

type NavLinkProps = {
  navUrl: string;
  navItem: string;
  isActive: boolean;
  navImg?: React.ReactNode;
  isPanelOpen: boolean;
  isChild?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onExpand?: () => void;
};

const NavLinkSingleItem = ({
  navUrl,
  navItem,
  isActive,
  navImg,
  isPanelOpen,
  isChild,
  hasChildren,
  isExpanded,
  onExpand,
}: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      onExpand?.();
    }
  };

  return (
    <NavLink
      to={navUrl}
      onClick={handleClick}
      className={cn(`flex cursor-pointer flex-col items-center`, {
        'w-full items-start p-2': isPanelOpen,
        'items-center justify-center p-0 pl-4 pr-2': isChild,
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
          {navImg && (
            <div
              className={cn(`flex items-center rounded-lg p-1`, {
                'bg-white': isActive,
                'bg-primary/10 group-hover:bg-white': !isActive,
              })}
            >
              {navImg}
            </div>
          )}
          <AnimatePresence>
            <motion.span
              className={cn(`text-base transition-all duration-300`, {
                'font-medium text-gray-900': isActive,
                'text-gray-500': !isActive,
                'w-auto': isPanelOpen,
                'hidden opacity-0': !isPanelOpen,
              })}
            >
              {navItem}
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

export default NavLinkSingleItem;
