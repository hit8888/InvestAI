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
    <NavLink to={navUrl} className={`flex w-full cursor-pointer flex-col items-start gap-[10px] bg-[#FBFBFE] p-2`}>
      <div
        className={cn(`flex w-full items-center gap-2 rounded-lg px-4 py-2`, {
          'bg-primary-adminBg': isActive,
          'bg-[#FBFBFE]': !isActive,
        })}
      >
        <div
          className={cn(`flex items-center gap-[10px] rounded-lg p-1`, {
            'bg-[#FBFBFE]': isActive,
            'bg-primary-adminBg': !isActive,
          })}
        >
          {navImg}
        </div>
        {isPanelOpen ? (
          <span
            className={cn(`text-base font-medium transition-all duration-300`, {
              'text-[#101828]': isActive,
              'text-[#667085]': !isActive,
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
