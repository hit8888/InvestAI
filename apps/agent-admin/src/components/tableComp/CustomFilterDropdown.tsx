import React, { useEffect, useRef, useState } from 'react';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';

// Define the type for the options
interface DropdownProps {
  options: string[];
  filterLabel: string;
}

const CustomFilterDropdown: React.FC<DropdownProps> = ({ options, filterLabel }) => {
  // State to track the selected options
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State to toggle dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to track the dropdown element
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle option toggle (select/deselect)
  const handleOptionClick = (option: string) => {
    setSelectedOption((prevSelected) => (prevSelected === option ? null : option));
    setIsOpen(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener for outside click
    document.addEventListener('click', handleOutsideClick);

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [setIsOpen]);
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2 px-4 py-2 font-inter text-[14px] font-semibold leading-[20px] text-[#667085] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        id="options-menu"
        onClick={toggleDropdown} // Toggle dropdown visibility
        aria-expanded="true"
        aria-haspopup="true"
      >
        {selectedOption || filterLabel}
        <DropdownIcon />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`${
                  selectedOption === option
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-indigo-600 hover:text-white'
                } block w-full px-4 py-2 text-left text-sm`}
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
