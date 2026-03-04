import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import DownloadIcon from '@breakout/design-system/components/icons/download-icon';
import { EXPORT_DOWNLOAD_LABEL, EXPORT_DOWNLOAD_RADIO_OPTIONS } from '../../utils/constants';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import CustomRadioGroupButtons from './CustomRadioGroupButtons';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import { useState } from 'react';
import { ConversationsPayload, LeadsPayload, ExportFormatType, ExportFormat } from '@neuraltrade/core/types/admin/api';
import { downloadTableData } from '../../utils/download/downloadService';
import { PaginationPageType } from '@neuraltrade/core/types/admin/admin';
interface DownloadProps {
  page: PaginationPageType;
  payloadData: ConversationsPayload | LeadsPayload;
}

const ExportDownload = ({ page, payloadData }: DownloadProps) => {
  const [selectedOption, setSelectedOption] = useState<ExportFormatType | null>(ExportFormat.CSV);
  const [downloadOpen, setDownloadOpen] = useState<boolean>(false);
  const handleDownloadButton = async () => {
    const isDownloadSuccessful = await downloadTableData({ page, payloadData, selectedOption });
    if (isDownloadSuccessful) {
      setDownloadOpen(false);
    }
  };

  const handleRadioOptions = (selectedOption: ExportFormatType | string) => {
    setSelectedOption(selectedOption as ExportFormatType);
  };

  return (
    <Popover open={downloadOpen} onOpenChange={setDownloadOpen}>
      <PopoverTrigger
        id={`table-${page}-export-button`}
        className="popover-styling border-gray-200-styling inline-flex items-center justify-center gap-2"
      >
        <DownloadIcon className="h-6 w-6 text-system" />
      </PopoverTrigger>

      <PopoverContent
        className="popover-boxshadow z-[100] w-80 rounded-lg bg-white p-0"
        align="start"
        side="top"
        sideOffset={20}
        alignOffset={-15}
      >
        <PopoverHeaderLabelWithCloseIcon headerLabel={EXPORT_DOWNLOAD_LABEL} />
        <CustomRadioGroupButtons
          radioOptions={EXPORT_DOWNLOAD_RADIO_OPTIONS}
          defaultSelected={selectedOption}
          onCallback={handleRadioOptions}
        />
        <CustomFooterWithButtons
          primaryBtnLabel={EXPORT_DOWNLOAD_LABEL}
          isDisabled={!selectedOption}
          onPrimaryBtnClicked={handleDownloadButton}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ExportDownload;
