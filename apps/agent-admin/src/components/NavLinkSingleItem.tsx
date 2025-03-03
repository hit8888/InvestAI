import { JSX } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SIDEBAR_TEXTUAL_CONTENT_ANIMATION_PROPS } from '../utils/constants';
import { getNavLinkContainerAnimation } from '../utils/common';

type NavLinkProps = {
  navUrl: string;
  navItem: string;
  isActive: boolean;
  navImg: JSX.Element;
  isPanelOpen: boolean;
};

const NavLinkSingleItem = ({ navUrl, navItem, isActive, navImg, isPanelOpen }: NavLinkProps) => {
  return (
    <NavLink
      to={navUrl}
      className={cn(`flex cursor-pointer flex-col items-start`, {
        'w-full p-2': isPanelOpen,
      })}
    >
      <motion.div
        className={cn(`group flex items-center gap-2 rounded-lg p-2`, {
          'bg-primary/20': isActive,
          'hover:bg-primary/10': !isActive,
        })}
        {...getNavLinkContainerAnimation(isPanelOpen)}
      >
        <div
          className={cn(`flex items-center rounded-lg p-1`, {
            'bg-white': isActive,
            'bg-primary/10 group-hover:bg-white': !isActive,
          })}
        >
          {navImg}
        </div>
        <AnimatePresence>
          <motion.span
            {...SIDEBAR_TEXTUAL_CONTENT_ANIMATION_PROPS}
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
      </motion.div>
    </NavLink>
  );
};

export default NavLinkSingleItem;
