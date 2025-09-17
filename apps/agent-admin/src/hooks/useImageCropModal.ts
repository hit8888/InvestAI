import { useRef, useState } from 'react';

export interface UseImageCropModalOptions {
  onCropComplete?: (croppedImageBlob: Blob) => void | Promise<void>;
  disabled?: boolean;
}

export interface UseImageCropModalReturn {
  // State
  selectedFile: File | null;
  showCropModal: boolean;
  isProcessing: boolean;

  // File input ref
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  // Actions
  triggerFileInput: () => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropComplete: (croppedImageBlob: Blob) => Promise<void>;
  handleCloseCropModal: () => void;
  setIsProcessing: (processing: boolean) => void;
}

/**
 * Custom hook for handling image crop modal logic
 * Provides reusable functionality for opening file picker, showing crop modal, and handling crop completion
 */
export const useImageCropModal = (options: UseImageCropModalOptions = {}): UseImageCropModalReturn => {
  const { onCropComplete, disabled = false } = options;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    // Set the selected file and show crop modal
    setSelectedFile(file);
    setShowCropModal(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (onCropComplete) {
      setIsProcessing(true);
      try {
        await onCropComplete(croppedImageBlob);
      } finally {
        setIsProcessing(false);
      }
    }

    // Close modal and reset file after processing
    handleCloseCropModal();
  };

  const handleCloseCropModal = () => {
    setShowCropModal(false);
    setSelectedFile(null);
  };

  const triggerFileInput = () => {
    if (!disabled && !isProcessing && !showCropModal) {
      fileInputRef.current?.click();
    }
  };

  return {
    // State
    selectedFile,
    showCropModal,
    isProcessing,

    // File input ref
    fileInputRef,

    // Actions
    triggerFileInput,
    handleImageUpload,
    handleCropComplete,
    handleCloseCropModal,
    setIsProcessing,
  };
};
