import { useEffect, useState } from 'react';
import Typography from '@breakout/design-system/components/Typography/index';
import SourcesDragDropPattern from '@breakout/design-system/components/icons/sources-dragdrop-patterns';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import AgentConfigUploadIcon from '@breakout/design-system/components/icons/agent-config-upload-icon';
import { cn } from '@breakout/design-system/lib/cn';
import { uploadAssetsFile } from '@meaku/core/adminHttp/api';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { trackError } from '@meaku/core/utils/error';
import { useSessionStore } from '../../stores/useSessionStore';
import ReactCropperModal from '../../components/AgentManagement/ReactCropperModal';
import { useImageCropModal } from '../../hooks/useImageCropModal';
import { checkFileSize } from '../../utils/common';
import { THREE_HUNDRED_MB } from '../../utils/constants';

interface AssetResponse {
  id: string;
  name: string;
  type: string;
  description: string;
  key: string;
  public_url: string;
}

interface ImagePreviewProps {
  imagePreview: string;
  isSquareLogo?: boolean;
  isUploading: boolean;
}

const ImagePreviewComponent: React.FC<ImagePreviewProps> = ({ imagePreview, isSquareLogo, isUploading }) => (
  <>
    <img src={imagePreview} alt="Uploaded logo" className="h-full w-full rounded-lg object-cover" />
    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-md bg-system/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {!isSquareLogo && !isUploading && (
        <Typography variant="label-16-medium" className="text-white">
          Replace logo
        </Typography>
      )}
      {!isUploading && <AgentConfigUploadIcon className="text-white" width={24} height={24} />}
    </div>
  </>
);

interface UploadPlaceholderProps {
  isUploading: boolean;
  isSquareLogo?: boolean;
}

const UploadPlaceholderComponent: React.FC<UploadPlaceholderProps> = ({ isUploading, isSquareLogo }) => (
  <>
    <SourcesDragDropPattern className="left-0 top-0 z-10 rounded-lg object-center" />
    <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center">
      {isUploading ? (
        <Typography variant={'caption-10-medium'} className="animate-pulse text-primary/60">
          {isSquareLogo ? '...' : 'Uploading...'}
        </Typography>
      ) : (
        <>
          <AgentConfigUploadIcon width={24} height={24} />
          <Typography variant={'caption-10-medium'} className="text-primary/60">
            Upload
          </Typography>
        </>
      )}
    </div>
  </>
);

interface AgentImageUploadProps {
  width: string;
  height: string;
  isSquareLogo?: boolean;
  initialImage?: string | null;
  onImageUpdate?: (image: string, assetData?: AssetResponse) => void;
  tooltipText?: string;
}

const AgentImageUpload: React.FC<AgentImageUploadProps> = ({
  width,
  height,
  isSquareLogo,
  initialImage,
  onImageUpdate,
  tooltipText,
}) => {
  const agentId = useSessionStore((state) => state.activeTenant?.agentId ?? 1);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage ?? null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialImage && initialImage.length > 0) {
      setImagePreview(initialImage ?? null);
    }
  }, [initialImage]);

  const handleCropCompleteInternal = async (croppedImageBlob: Blob) => {
    try {
      setIsUploading(true);

      // Get the original file extension and type
      const originalFileName = selectedFile?.name || 'cropped-image.png';
      const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
      const fileType = selectedFile?.type || 'image/png';

      // Convert blob to file with original extension and type
      const croppedFile = new File([croppedImageBlob], `cropped-image${fileExtension}`, {
        type: fileType,
      });

      const { status, error } = checkFileSize(croppedFile, THREE_HUNDRED_MB);
      if (!status) {
        ErrorToastMessage({
          title: error || '',
        });
        return;
      }

      const response = await uploadAssetsFile(croppedFile);
      const assetData = response.data as AssetResponse;

      // Set preview using the public_url from the response
      setImagePreview(assetData.public_url);
      onImageUpdate?.(assetData.public_url, assetData);
    } catch (error) {
      console.error('Error uploading image:', error);
      ErrorToastMessage({
        title: `Image unable to upload, error has been reported.`,
      });
      trackError(error, {
        action: 'AgentImageUpload Api call',
        component: 'AgentImageUpload function',
        additionalData: {
          agentId,
          tenantName: useSessionStore.getState().activeTenant?.['tenant-name'],
          errorMessage: 'Unable to upload Image',
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const {
    selectedFile,
    showCropModal,
    isProcessing,
    fileInputRef,
    triggerFileInput,
    handleImageUpload,
    handleCropComplete,
    handleCloseCropModal,
  } = useImageCropModal({
    onCropComplete: handleCropCompleteInternal,
    disabled: isUploading,
  });

  const getTooltipContentElement = () => {
    return (
      <Typography variant={'caption-12-medium'} textColor={'white'}>
        {tooltipText || `Please upload the ${isSquareLogo ? 'Favicon' : 'Full Logo'}`}
      </Typography>
    );
  };

  const isDisabled = isUploading || showCropModal || isProcessing;

  return (
    <div
      className={cn(
        'group relative flex aspect-square cursor-pointer items-center justify-center self-stretch rounded-lg border border-primary/60',
        {
          'px-1 py-1': !!imagePreview?.length,
          'border-dashed': !imagePreview?.length,
          'cursor-not-allowed opacity-50': isDisabled,
        },
      )}
      style={{ width, height }}
      onClick={triggerFileInput}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerFileInput();
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden h-full w-full"
        accept="image/*"
        onClick={() => {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        onChange={handleImageUpload}
        disabled={isDisabled}
      />

      {imagePreview ? (
        <ImagePreviewComponent
          imagePreview={imagePreview}
          isSquareLogo={isSquareLogo}
          isUploading={isUploading || isProcessing}
        />
      ) : (
        <TooltipWrapperDark
          showTooltip={!imagePreview}
          trigger={<UploadPlaceholderComponent isUploading={isUploading || isProcessing} isSquareLogo={isSquareLogo} />}
          content={getTooltipContentElement()}
          tooltipAlign="center"
          tooltipSideOffsetValue={32}
          showArrow={false}
          alwaysVisible={false}
        />
      )}

      {/* Image Crop Modal */}
      <ReactCropperModal
        isOpen={showCropModal}
        onClose={handleCloseCropModal}
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        outputWidth={isSquareLogo ? 60 : 240}
        outputHeight={isSquareLogo ? 60 : 60}
        outputMimeType={selectedFile?.type || 'image/png'}
      />
    </div>
  );
};

export default AgentImageUpload;
