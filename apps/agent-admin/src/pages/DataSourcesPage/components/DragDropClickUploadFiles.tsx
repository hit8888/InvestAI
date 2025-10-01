import { useDataSources } from '../../../context/DataSourcesContext';
import LoadingDialogMessage from './LoadingDialogMessage';
import FileUploadHandler from './FileUploadHandler';
import SourcesDragDropUploadIcon from '@breakout/design-system/components/icons/sources-dragdrop-upload-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { Accept } from 'react-dropzone';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { checkFileSize } from '../../../utils/common';
import { FIVE_MB } from '../../../utils/constants';

type DragDropClickUploadFilesProps = {
  showIcon?: boolean;
  uploadTitle?: string;
  defaultMessage?: string;
  acceptedFiles?: Accept | undefined;
  errorMessage: string;
  loadingDialogMessage: string;
  fileLimit?: number;
  onUploadSuccess?: (file: File) => void | Promise<void>;
  fileSizeLimit?: number;
  uploadProgress?: number;
};

const DragDropClickUploadFiles = ({
  showIcon = true,
  uploadTitle,
  defaultMessage,
  acceptedFiles,
  errorMessage,
  loadingDialogMessage,
  fileLimit,
  fileSizeLimit,
  onUploadSuccess,
  uploadProgress,
}: DragDropClickUploadFilesProps) => {
  const { isUploading, toggleIsUploadingValue } = useDataSources();
  const { uploadProgress: localUploadProgress, uploadFiles } = useFileUpload();

  const fileSizeValidation = (files: File[]) => {
    // File size check
    for (const file of files) {
      const { status, error } = checkFileSize(file, fileSizeLimit || FIVE_MB);
      if (!status) {
        ErrorToastMessage({
          title: error || '',
          position: 'top-center',
        });
        return false;
      }
    }
    return true;
  };

  const handleFileSelect = async (files: File[]) => {
    const isFileSizeValid = fileSizeValidation(files);
    if (!isFileSizeValid) return;
    toggleIsUploadingValue(true);
    try {
      if (onUploadSuccess) {
        await onUploadSuccess(files[0]);
      } else {
        await uploadFiles(files, fileLimit || Infinity);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      toggleIsUploadingValue(false);
    }
  };

  if (isUploading) {
    return <LoadingDialogMessage progress={uploadProgress || localUploadProgress} message={loadingDialogMessage} />;
  }

  return (
    <FileUploadHandler onFileSelect={handleFileSelect} acceptedFiles={acceptedFiles} errorMessage={errorMessage}>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-1">
        {showIcon && <SourcesDragDropUploadIcon width="32" height="32" className="text-primary" />}
        <div className="flex flex-col items-center gap-1 self-stretch">
          <Typography variant={'label-14-medium'} align={'center'} textColor={'primary'}>
            {uploadTitle || 'Drag and drop files here, or click to browse'}
          </Typography>
          <Typography variant={'caption-10-normal'} align={'center'} className="text-primary/60">
            {defaultMessage}
          </Typography>
        </div>
      </div>
    </FileUploadHandler>
  );
};

export default DragDropClickUploadFiles;
