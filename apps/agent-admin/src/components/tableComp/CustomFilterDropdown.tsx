import React, { useRef, useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import usePopperPosition from '../../hooks/usePopperPosition';
import useClickOutside from '@breakout/design-system/hooks/useClickOutside';
import FilterMenuOption from './FilterMenuOption';
import DropdownTriggerButton from './DropdownTriggerButton';

// Define the type for the options
interface DropdownProps {
  options: string[];
  filterLabel: string;
  staticValue?: string;
  onCallback?: (selectedOption: string | null) => void;
}

const CustomFilterDropdown: React.FC<DropdownProps> = ({ options, filterLabel, staticValue = '', onCallback }) => {
  // State to track the selected options
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State to toggle dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to track the dropdown element
  const dropdownRef = useRef<HTMLDivElement>(null!);
  const dropdownOptionMenuRef = useRef<HTMLDivElement>(null);
  const buttonTriggerRef = useRef<HTMLButtonElement>(null);

  // Handle option toggle (select/deselect)
  const handleOptionClick = (option: string) => {
    setSelectedOption((prevSelected) => (prevSelected === option ? null : option));
    onCallback?.(option); // Call the parent-provided callback
    setIsOpen(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Use the custom hook to close the dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Use the custom hook to determine the position of dropdown menu based on available space.
  const dropdownMenuPosition = usePopperPosition(isOpen, buttonTriggerRef, dropdownOptionMenuRef);

  const isDropdownMenuPositionTop = dropdownMenuPosition === 'top';
  return (
    <div className="relative z-20 inline-block text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <DropdownTriggerButton
        btnLabel={selectedOption || filterLabel}
        btnRef={buttonTriggerRef}
        onToggleDropdown={toggleDropdown}
        staticValue={staticValue}
        isDropdownOpen={isOpen}
      />

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={dropdownOptionMenuRef}
          className={cn(
            `absolute right-0 z-20 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`,
            {
              'bottom-full mb-2': isDropdownMenuPositionTop,
              'top-full mt-2': !isDropdownMenuPositionTop,
            },
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <FilterMenuOption
                key={option}
                menuOptionTitle={option}
                onMenuOptionClicked={() => handleOptionClick(option)}
                isSelectedOption={selectedOption === option}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFilterDropdown;
