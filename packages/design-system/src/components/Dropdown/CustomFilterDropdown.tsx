import React, { useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import FilterMenuOption from './FilterMenuOption';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@breakout/design-system/components/shadcn-ui/dropdown-menu';

export const COMMON_ICON_PROPS = {
  width: '24',
  height: '25',
  viewBox: '0 0 24 25',
  color: 'rgb(var(--primary))',
};

// Define the type for the options
interface DropdownProps {
  options: string[];
  filterLabel: string;
  staticValue?: string;
  onCallback?: (selectedOption: string | null) => void;
}

const CustomFilterDropdown: React.FC<DropdownProps> = ({ options, filterLabel, staticValue = '', onCallback }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle option toggle (select/deselect)
  const handleOptionClick = (option: string) => {
    setSelectedOption((prevSelected) => (prevSelected === option ? null : option));
    onCallback?.(option); // Call the parent-provided callback
    setIsDropdownOpen(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={toggleDropdown}>
      <DropdownMenuTrigger
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg 
        border border-primary/20 bg-primary/2.5 p-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-primary/10 
        focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        <span>{selectedOption || filterLabel}</span>
        {staticValue && <span className="font-normal">{staticValue}</span>}
        <span
          className={cn('h-5 w-5', {
            'rotate-0': !isDropdownOpen,
            'translate-x-1 translate-y-1 rotate-180': isDropdownOpen,
          })}
        >
          <DropdownIcon {...COMMON_ICON_PROPS} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        asChild
        align="start"
        className="dropdown-menu-content hide-scrollbar z-20 mt-2 max-h-96 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <DropdownMenuGroup>
          {options.map((option) => (
            <FilterMenuOption
              key={option}
              menuOptionTitle={option}
              onMenuOptionClicked={() => handleOptionClick(option)}
              isSelectedOption={selectedOption === option}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomFilterDropdown;
