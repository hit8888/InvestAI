import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DATA_SOURCES_ACCEPTED_FILE_TYPES, FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE } from '../constants';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';

interface FileUploadHandlerProps {
  selectedType: string;
  onFileSelect: (files: File[]) => void;
  children: React.ReactNode;
}

const FileUploadHandler = ({ selectedType, onFileSelect, children }: FileUploadHandlerProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: DATA_SOURCES_ACCEPTED_FILE_TYPES[selectedType as keyof typeof DATA_SOURCES_ACCEPTED_FILE_TYPES],
    onDropRejected: () => {
      const errorMessage =
        FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE[
          selectedType as keyof typeof FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE
        ];

      ErrorToastMessage({
        title: errorMessage,
      });
    },
  });

  return (
    <div {...getRootProps()} className="h-full w-full">
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default FileUploadHandler;
