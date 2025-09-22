import { useDataSources } from '../../../context/DataSourcesContext';
import { DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT, SourcesCardTypes } from '../constants';
import LoadingDialogMessage from './LoadingDialogMessage';
import FileUploadHandler from './FileUploadHandler';
import SourcesDragDropUploadIcon from '@breakout/design-system/components/icons/sources-dragdrop-upload-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { useFileUpload } from '../../../hooks/useFileUpload';

const { WEBPAGES } = SourcesCardTypes;

const DragDropClickUploadFiles = () => {
  const { selectedType, isUploading, toggleIsUploadingValue } = useDataSources();
  const { uploadProgress, uploadFiles } = useFileUpload();
  const message =
    DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT[selectedType as keyof typeof DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT];

  const handleFileSelect = async (files: File[]) => {
    if (!selectedType) return;
    toggleIsUploadingValue(true);
    await uploadFiles(files);
    toggleIsUploadingValue(false);
  };

  if (!selectedType || selectedType === WEBPAGES) {
    return null;
  }

  if (isUploading) {
    return <LoadingDialogMessage progress={uploadProgress} />;
  }

  return (
    <FileUploadHandler selectedType={selectedType} onFileSelect={handleFileSelect}>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1">
        <SourcesDragDropUploadIcon width="32" height="32" className="text-primary" />
        <div className="flex flex-col items-center gap-1 self-stretch">
          <Typography variant={'label-14-medium'} align={'center'} textColor={'primary'}>
            Drag and drop files here, or click to browse
          </Typography>
          <Typography variant={'caption-10-normal'} align={'center'} className="text-primary/60">
            {message}
          </Typography>
        </div>
      </div>
    </FileUploadHandler>
  );
};

export default DragDropClickUploadFiles;
