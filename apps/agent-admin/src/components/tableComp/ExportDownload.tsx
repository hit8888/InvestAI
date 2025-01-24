import React, { useState } from 'react';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@breakout/design-system/components/Popover/index';
import TooltipArrowIcon from '@breakout/design-system/components/icons/tooltip-arrow';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import DownloadIcon from '@breakout/design-system/components/icons/download-icon';

import {
  XSLS_LABEL,
  CSV_LABEL,
  EXPORT_DOWNLOAD_ICONS,
  EXPORT_DOWNLOAD_LABEL,
  DOWNLOAD_ITEM_EXPORT_CSV_LABEL,
  DOWNLOAD_ITEM_EXPORT_XSLS_LABEL,
} from '../../utils/constants';
import ExportDownloadButton from './ExportDownloadButton';
// import { handleDownload } from '../../utils/common';
import RadioButtonWithLabel from './RadioButtonWithLabel';
import { RadioGroup } from '@breakout/design-system/components/shadcn-ui/radio-group';

// Define the type for the options
interface DownloadProps {
  onCallback?: (selectedOption: string | null) => void;
}

const ExportDownload: React.FC<DownloadProps> = () => {
  // State to track the selected options
  const [selectedOption, setSelectedOption] = useState<string>(XSLS_LABEL);

  const handleDownloadButton = () => {
    return;
    // const fileTypeLowercase = selectedOption.toLowerCase() as 'xsls' | 'csv';
    // console.log(`Downloaded file local.${fileTypeLowercase}`);
    // const apiUrls = {
    //   xsls: 'https://example.com/api/download/file.xsls', // TODOS: Replace with actual URL
    //   csv: 'https://example.com/api/download/file.csv', // TODOS: Replace with actual URL
    // };
    // // TODOS: Pass actual Parameter for Integration
    // handleDownload(fileTypeLowercase, apiUrls[fileTypeLowercase], 'example');
  };

  const handleRadioOptions = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <Popover>
      {/* Dropdown button */}
      <PopoverTrigger
        className="inline-flex items-center justify-center gap-2 rounded-lg 
      border border-primary/20 bg-primary/2.5 !p-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-primary/10 
      focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        <DownloadIcon width={'24'} height={'24'} viewBox="0 0 24 24" />
      </PopoverTrigger>

      <PopoverContent
        className="download-boxshadow z-20 w-80 rounded-lg bg-white p-0"
        align="start"
        side="top"
        sideOffset={15}
        alignOffset={-20}
      >
        <div className="absolute -top-3 flex items-center px-8">
          <span className="h-6 w-6">
            <TooltipArrowIcon width={'18'} height={'16'} color="white" viewBox="0 0 18 16" />
          </span>
        </div>
        <div className="flex w-full items-start justify-between px-4 py-3">
          <p className="text-lg font-semibold text-gray-900">{EXPORT_DOWNLOAD_LABEL}</p>
          <PopoverClose>
            <CrossIcon className="cursor-pointer" {...EXPORT_DOWNLOAD_ICONS} />
          </PopoverClose>
        </div>
        <RadioGroup
          value={selectedOption}
          onValueChange={handleRadioOptions}
          className="flex flex-col items-start gap-6 self-stretch px-4 py-6"
        >
          <RadioButtonWithLabel
            value={XSLS_LABEL}
            radioLabel={DOWNLOAD_ITEM_EXPORT_XSLS_LABEL}
            isRadioSelected={selectedOption === XSLS_LABEL}
          />
          <RadioButtonWithLabel
            value={CSV_LABEL}
            radioLabel={DOWNLOAD_ITEM_EXPORT_CSV_LABEL}
            isRadioSelected={selectedOption === CSV_LABEL}
          />
        </RadioGroup>
        <div className="flex items-start justify-end self-stretch border-t border-dashed border-gray-200 p-4">
          <ExportDownloadButton btnLabel={EXPORT_DOWNLOAD_LABEL} onDownloadBtnClicked={handleDownloadButton} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExportDownload;
