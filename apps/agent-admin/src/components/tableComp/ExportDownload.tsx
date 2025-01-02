import React, { useRef, useState } from 'react';
import TooltipArrowIcon from '@breakout/design-system/components/icons/tooltip-arrow';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import useClickOutside from '@breakout/design-system/hooks/useClickOutside';
import {
  XSLS_LABEL,
  CSV_LABEL,
  EXPORT_DOWNLOAD_ICONS,
  EXPORT_DOWNLOAD_LABEL,
  DOWNLOAD_ITEM_EXPORT_CSV_LABEL,
  DOWNLOAD_ITEM_EXPORT_XSLS_LABEL,
} from '../../utils/constants';
import ExportDownloadButton from './ExportDownloadButton';
import { handleDownload } from '../../utils/common';
import RadioButtonWithLabel from './RadioButtonWithLabel';
import DropdownTriggerButton from './DropdownTriggerButton';

// Define the type for the options
interface DownloadProps {
  onCallback?: (selectedOption: string | null) => void;
}

const ExportDownload: React.FC<DownloadProps> = () => {
  // State to track the selected options
  const [selectedOption, setSelectedOption] = useState<string>(XSLS_LABEL);

  // State to toggle dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Ref to track the dropdown element
  const dropdownRef = useRef<HTMLDivElement>(null!);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleDownloadButton = () => {
    const fileTypeLowercase = selectedOption.toLowerCase() as 'xsls' | 'csv';
    console.log(`Downloaded file local.${fileTypeLowercase}`);
    const apiUrls = {
      xsls: 'https://example.com/api/download/file.xsls', // TODOS: Replace with actual URL
      csv: 'https://example.com/api/download/file.csv', // TODOS: Replace with actual URL
    };
    // TODOS: Pass actual Parameter for Integration
    handleDownload(fileTypeLowercase, apiUrls[fileTypeLowercase], 'example');
  };

  // Use the custom hook to close the dropdown when clicking outside
  useClickOutside(dropdownRef, () => setIsOpen(false));
  return (
    <div className="relative z-20 inline-block text-left" ref={dropdownRef}>
      {/* Dropdown button */}
      <DropdownTriggerButton
        btnLabel={EXPORT_DOWNLOAD_LABEL}
        onToggleDropdown={toggleDropdown}
        isDropdownOpen={isOpen}
      />

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`download-boxshadow absolute z-20 mt-4 flex w-80 flex-col items-start rounded-lg bg-white`}
          role="popper"
          aria-orientation="vertical"
          aria-labelledby="download-content-popper"
        >
          <div className=" absolute -top-3 flex items-center px-8">
            <span className="h-6 w-6">
              <TooltipArrowIcon width={'18'} height={'16'} color="white" viewBox="0 0 18 16" />
            </span>
          </div>
          <div className="flex w-full items-start justify-between px-4 py-3">
            <p className="text-lg font-semibold text-gray-900">{EXPORT_DOWNLOAD_LABEL}</p>
            <CrossIcon className="cursor-pointer" {...EXPORT_DOWNLOAD_ICONS} onClick={() => setIsOpen(false)} />
          </div>
          <div className="flex flex-col items-start gap-6 self-stretch px-4 py-6">
            <RadioButtonWithLabel
              key={XSLS_LABEL}
              radioLabel={DOWNLOAD_ITEM_EXPORT_XSLS_LABEL}
              isRadioSelected={selectedOption === XSLS_LABEL}
              onRadioClicked={() => setSelectedOption(XSLS_LABEL)}
            />
            <RadioButtonWithLabel
              key={CSV_LABEL}
              radioLabel={DOWNLOAD_ITEM_EXPORT_CSV_LABEL}
              isRadioSelected={selectedOption === CSV_LABEL}
              onRadioClicked={() => setSelectedOption(CSV_LABEL)}
            />
          </div>
          <div className="flex w-full items-start border-t border-dashed border-gray-200 p-4">
            <ExportDownloadButton btnLabel={EXPORT_DOWNLOAD_LABEL} onDownloadBtnClicked={handleDownloadButton} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDownload;
