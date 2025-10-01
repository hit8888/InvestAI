import { useCallback } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
interface FileUploadHandlerProps {
  acceptedFiles: Accept | undefined;
  errorMessage: string;
  onFileSelect: (files: File[]) => void;
  children: React.ReactNode;
}

const FileUploadHandler = ({ acceptedFiles, errorMessage, onFileSelect, children }: FileUploadHandlerProps) => {
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
    accept: acceptedFiles,
    onDropRejected: () => {
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
