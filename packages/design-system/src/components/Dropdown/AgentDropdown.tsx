import React, { useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@breakout/design-system/components/shadcn-ui/dropdown-menu';
import DropdownOption from './DropdownOption';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';

// Define the type for the options
interface DropdownProps {
  options: string[];
  placeholderLabel: string;
  onCallback?: (selectedOption: string | null) => void;
  className?: string;
}

// Also Add check for is_required key
const AgentDropdown: React.FC<DropdownProps> = ({ options, placeholderLabel, onCallback, className }) => {
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
        className={cn(
          `inline-flex h-16 w-full max-w-[800px] cursor-pointer 
          items-center justify-between gap-2 rounded-xl 
          border border-gray-300 bg-white p-6 text-xl 
          text-customPrimaryText shadow-sm hover:bg-gray-25 focus:outline-none`,
          {
            'ring-4 ring-primary/20': isDropdownOpen,
          },
          className,
        )}
      >
        {!selectedOption && placeholderLabel ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="overflow-hidden truncate whitespace-nowrap text-sm text-gray-400">
                  {placeholderLabel}
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-white">
                <p className="text-black">{placeholderLabel}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
        {selectedOption ? <span className="truncate text-sm">{selectedOption}</span> : null}
        <span
          className={cn('h-5 w-5 flex-shrink-0', {
            'rotate-0': !isDropdownOpen,
            'translate-x-1 translate-y-1 rotate-180': isDropdownOpen,
          })}
        >
          <DropdownIcon className="text-gray-900" width={'24'} height={'24'} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        asChild
        align="start"
        className="dropdown-menu-content hide-scrollbar z-20 max-h-96 overflow-auto rounded-lg bg-white p-0 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownOption
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

export default AgentDropdown;
