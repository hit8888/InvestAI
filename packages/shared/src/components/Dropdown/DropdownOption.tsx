import React from 'react';
import { DropdownMenuItem, LucideIcon, cn } from '@meaku/saral';

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
          'relative flex w-full cursor-pointer select-none items-center justify-start gap-4 px-4 py-3 text-left capitalize text-gray-900 outline-none data-[highlighted]:text-gray-900',
          'focus:bg-gray-50',
          {
            'bg-gray-200 data-[highlighted]:bg-gray-200': isSelectedOption,
            'hover:bg-gray-100 data-[highlighted]:bg-gray-100': !isSelectedOption,
          },
          menuItemClassName,
        )}
        style={{ fontFamily: applyFontFamily ? menuOptionTitle : undefined }}
      >
        {showIcon &&
          (isSelectedOption ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-900">
              <LucideIcon name="check" className="text-white" width="12" height="12" />
            </span>
          ) : (
            <LucideIcon name="circle" className="text-gray-500" />
          ))}
        <span className="truncate">{menuOptionTitle}</span>
      </DropdownMenuItem>
    );
  },
);

DropdownOption.displayName = 'DropdownOption';

export default DropdownOption;
