import React, { useRef, useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import DropdownIcon from '@breakout/design-system/components/icons/dropdown-icon';
import useClickOutside from '@breakout/design-system/hooks/useClickOutside';
import { DROPDOWN_ARROW_ICONS, EXPORT_DOWNLOAD_LABEL } from '../../utils/constants';

// Define the type for the options
interface DownloadProps {
  onCallback?: (selectedOption: string | null) => void;
}

const ExportDownload: React.FC<DownloadProps> = () => {
  // State to track the selected options
  //   const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State to toggle dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to track the dropdown element
  const dropdownRef = useRef<HTMLDivElement>(null!);

  // Handle option toggle (select/deselect)
  //   const handleOptionClick = (option: string) => {
  //     setSelectedOption((prevSelected) => (prevSelected === option ? null : option));
  //     onCallback?.(option); // Call the parent-provided callback
  //     setIsOpen(false);
  //   };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Use the custom hook to close the dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));
  return (
    <div className="relative z-20 inline-block text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <button
        type="button"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg 
        border border-primary/20 bg-primary/2.5 p-2 text-sm font-semibold text-gray-500 shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-primary/60"
        id="options-menu"
        onClick={toggleDropdown} // Toggle dropdown visibility
        aria-expanded="true"
        aria-haspopup="true"
      >
        {EXPORT_DOWNLOAD_LABEL}
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
          className={`absolute right-0 z-20 mt-2 h-52 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="popper"
          aria-orientation="vertical"
          aria-labelledby="download-content-popper"
        ></div>
      )}
    </div>
  );
};

export default ExportDownload;
