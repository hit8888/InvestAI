import { JSX } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { NavLink } from 'react-router-dom';

type NavLinkProps = {
  navUrl: string;
  navItem: string;
  isActive: boolean;
  navImg: JSX.Element;
  isPanelOpen?: boolean;
};

const NavLinkSingleItem = ({ navUrl, navItem, isActive, navImg, isPanelOpen }: NavLinkProps) => {
  return (
    <NavLink to={navUrl} className={`flex w-full cursor-pointer flex-col items-start p-2`}>
      <div
        className={cn(`flex w-full items-center gap-2 rounded-lg px-4 py-2`, {
          'bg-primary/10': isActive,
        })}
      >
        <div
          className={cn(`flex items-center rounded-lg p-1`, {
            'bg-white': isActive,
            'bg-primary/10': !isActive,
          })}
        >
          {navImg}
        </div>
        {isPanelOpen ? (
          <span
            className={cn(`text-base font-medium transition-all duration-300`, {
              'text-gray-900': isActive,
              'text-gray-500': !isActive,
              'w-auto': isPanelOpen,
              'w-0 overflow-hidden': !isPanelOpen,
            })}
          >
            {navItem}
          </span>
        ) : null}
      </div>
    </NavLink>
  );
};

export default NavLinkSingleItem;
