import React from 'react';
import { DropdownMenuItem } from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import { cn } from '@breakout/design-system/lib/cn';
import MenuOptionNotSelectedIcon from '../icons/menuoption-not-selected-icon';
import MenuOptionSelectedIcon from '../icons/menuoption-selected-icon';

interface MenuOptionProps {
  menuOptionTitle: string;
  onMenuOptionClicked: () => void;
  isSelectedOption: boolean;
  showIcon?: boolean;
  applyFontFamily?: boolean;
  menuItemClassName?: string;
}

const DropdownOption = React.memo(
  ({
    menuOptionTitle,
    onMenuOptionClicked,
    isSelectedOption,
    showIcon = true,
    applyFontFamily = false,
    menuItemClassName,
  }: MenuOptionProps) => {
    return (
      <DropdownMenuItem
        key={menuOptionTitle}
        onSelect={(event) => {
          // Prevent the default selection behavior
          event.preventDefault();
          onMenuOptionClicked();
        }}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center justify-start gap-4 px-4 py-3 text-left capitalize text-gray-900 outline-none',
          'focus:bg-gray-50',
          {
            'bg-gray-200 data-[highlighted]:bg-gray-200': isSelectedOption,
            'hover:bg-gray-100 data-[highlighted]:bg-gray-100': !isSelectedOption,
          },
          menuItemClassName,
        )}
        style={{ fontFamily: applyFontFamily ? menuOptionTitle : undefined }}
      >
        <>
          {showIcon && (
            <>
              {isSelectedOption ? (
                <MenuOptionSelectedIcon width="24" height="24" className="text-gray-900" />
              ) : (
                <MenuOptionNotSelectedIcon width="24" height="24" className="text-gray-500" />
              )}
            </>
          )}
        </>
        <span className="truncate">{menuOptionTitle}</span>
      </DropdownMenuItem>
    );
  },
);

DropdownOption.displayName = 'DropdownOption';

export default DropdownOption;
