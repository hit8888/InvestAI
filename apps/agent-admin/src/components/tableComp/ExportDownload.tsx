import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import DownloadIcon from '@breakout/design-system/components/icons/download-icon';
import { EXPORT_DOWNLOAD_LABEL, EXPORT_DOWNLOAD_RADIO_OPTIONS } from '../../utils/constants';
// import { handleDownload } from '../../utils/common';
import PopoverHeaderLabelWithCloseIcon from './PopoverHeaderLabelWithCloseIcon';
import CustomRadioGroupButtons from './CustomRadioGroupButtons';
import CustomFooterWithButtons from './CustomFooterWithButtons';

interface DownloadProps {
  onCallback?: (selectedOption: string | null) => void;
}

const ExportDownload = ({ onCallback }: DownloadProps) => {
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

  const handleRadioOptions = (selectedOption: string) => {
    // console.log('ExportDownload Selected option:', selectedOption);
    onCallback?.(selectedOption);
  };

  return (
    <Popover>
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
        <CustomRadioGroupButtons radioOptions={EXPORT_DOWNLOAD_RADIO_OPTIONS} onCallback={handleRadioOptions} />
        <CustomFooterWithButtons primaryBtnLabel={EXPORT_DOWNLOAD_LABEL} onPrimaryBtnClicked={handleDownloadButton} />
      </PopoverContent>
    </Popover>
  );
};

export default ExportDownload;
