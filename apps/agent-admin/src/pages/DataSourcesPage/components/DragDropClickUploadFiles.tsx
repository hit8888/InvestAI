import { useDataSources } from '../../../context/DataSourcesContext';
import LoadingDialogMessage from './LoadingDialogMessage';
import FileUploadHandler from './FileUploadHandler';
import SourcesDragDropUploadIcon from '@breakout/design-system/components/icons/sources-dragdrop-upload-icon';
import Typography from '@breakout/design-system/components/Typography/index';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { Accept } from 'react-dropzone';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { checkFileSize } from '../../../utils/common';
import { THREE_HUNDRED_MB } from '../../../utils/constants';
import { cn } from '@breakout/design-system/lib/cn';

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
  showContentAtCenter?: boolean;
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
  showContentAtCenter = true,
}: DragDropClickUploadFilesProps) => {
  const { isUploading, toggleIsUploadingValue } = useDataSources();
  const { uploadProgress: localUploadProgress, uploadFiles } = useFileUpload();

  const fileSizeValidation = (files: File[]) => {
    // File size check
    for (const file of files) {
      const { status, error } = checkFileSize(file, fileSizeLimit || THREE_HUNDRED_MB);
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
      <div
        className={cn('relative z-10 flex h-full w-full items-start justify-start gap-4 p-6', {
          'flex-col items-center justify-center gap-1': showContentAtCenter,
        })}
      >
        {showIcon && <SourcesDragDropUploadIcon width="32" height="32" className="text-primary" />}
        <div
          className={cn('flex flex-col items-start gap-1 self-stretch', {
            'items-center': showContentAtCenter,
          })}
        >
          <Typography variant={'label-14-medium'} align={'center'}>
            {uploadTitle || 'Drag and drop files here, or click to browse'}
          </Typography>
          <Typography variant="caption-12-normal" align={'center'} textColor={'gray500'}>
            {defaultMessage}
          </Typography>
        </div>
      </div>
    </FileUploadHandler>
  );
};

export default DragDropClickUploadFiles;
