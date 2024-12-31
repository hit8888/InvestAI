import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';
import useClickOutside from '@breakout/design-system/hooks/useClickOutside';
import { DROPDOWN_ARROW_ICONS } from '../../utils/constants';

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

  const [dropdownMenuPosition, setDropdownMenuPosition] = useState<'top' | 'bottom'>('bottom');

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

  useEffect(() => {
    if (isOpen) {
      const buttonRect = buttonTriggerRef.current?.getBoundingClientRect();
      const dropdownHeight = dropdownOptionMenuRef.current?.offsetHeight || 0;

      if (buttonRect) {
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownMenuPosition('top');
        } else {
          setDropdownMenuPosition('bottom');
        }
      }
    }
  }, [isOpen]);
  return (
    <div className="relative z-20 inline-block text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        ref={buttonTriggerRef}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg 
        border border-[#DCDAF8] bg-[#FBFBFE] p-2 text-sm font-semibold text-[#667085] shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500"
        id="options-menu"
        onClick={toggleDropdown} // Toggle dropdown visibility
        aria-expanded="true"
        aria-haspopup="true"
      >
        {selectedOption || filterLabel}
        <span className="font-normal">{staticValue ? `  ${staticValue}` : ''}</span>
        <span
          className={cn('h-5 w-5', {
            'rotate-0': !isOpen,
            'translate-x-1 translate-y-1 rotate-180': isOpen,
          })}
        >
          <DropdownIcon {...DROPDOWN_ARROW_ICONS} />
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={dropdownOptionMenuRef}
          className={`absolute right-0 z-20 mt-2 w-full ${
            dropdownMenuPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={cn(`block w-full px-4 py-2 text-left text-sm hover:bg-indigo-600 hover:text-white`, {
                  'text-indigo-600': selectedOption === option,
                  'text-gray-700': !(selectedOption === option),
                })}
                role="menuitem"
              >
                {option}
                {selectedOption === option && <span className="ml-2 text-indigo-500">✔</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFilterDropdown;
