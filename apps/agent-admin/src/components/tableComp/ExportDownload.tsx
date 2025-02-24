import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import DownloadIcon from '@breakout/design-system/components/icons/download-icon';
import { EXPORT_DOWNLOAD_LABEL, EXPORT_DOWNLOAD_RADIO_OPTIONS } from '../../utils/constants';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import CustomRadioGroupButtons from './CustomRadioGroupButtons';
import CustomFooterWithButtons from './CustomFooterWithButtons';
import { useState } from 'react';
import { ConversationsPayload, LeadsPayload, ExportFormatType, ExportFormat } from '@meaku/core/types/admin/api';
import { downloadTableData } from '../../utils/download/downloadService';
interface DownloadProps {
  page: string;
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
        className="inline-flex items-center justify-center gap-2 rounded-lg 
      border border-primary/20 bg-primary/2.5 !p-2 text-sm font-semibold text-gray-500 shadow-sm hover:bg-primary/10 
      focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/60 data-[state=open]:border-2 data-[state=open]:border-primary"
      >
        <DownloadIcon width={'24'} height={'24'} viewBox="0 0 24 24" />
      </PopoverTrigger>

      <PopoverContent
        className="popover-boxshadow z-50 w-80 rounded-lg bg-white p-0"
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
