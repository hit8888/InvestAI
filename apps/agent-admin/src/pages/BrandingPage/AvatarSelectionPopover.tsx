import Typography from '@breakout/design-system/components/Typography/index';
import SourcesDragDropPattern from '@breakout/design-system/components/icons/sources-dragdrop-patterns';
import AgentConfigUploadIcon from '@breakout/design-system/components/icons/agent-config-upload-icon';
import UploadPictureIcon from '@breakout/design-system/components/icons/upload-picture-icon';
import { cn } from '@breakout/design-system/lib/cn';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import ReactCropperModal from '../../components/AgentManagement/ReactCropperModal';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import Button from '@breakout/design-system/components/Button/index';
import type { AvatarSelectionPopoverProps } from './useAvatarSelectionPopover';
import { useAvatarSelectionPopover } from './useAvatarSelectionPopover';

interface ImagePreviewProps {
  imagePreview: string;
  isSquareLogo?: boolean;
  isUploading: boolean;
}

const ImagePreviewComponent: React.FC<ImagePreviewProps> = ({ imagePreview, isSquareLogo, isUploading }) => (
  <>
    <img src={imagePreview} alt="Uploaded avatar" className="h-full w-full rounded-lg object-cover" />
    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-system/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {!isSquareLogo && !isUploading && (
        <Typography variant="label-16-medium" className="text-white">
          Replace avatar
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

const AvatarSelectionPopover: React.FC<AvatarSelectionPopoverProps> = ({
  width,
  height,
  isSquareLogo,
  initialImage,
  onImageUpdate,
  tooltipText,
}) => {
  const {
    avatarComponents,
    cropOutputHeight,
    cropOutputMimeType,
    cropOutputWidth,
    fileInputRef,
    handleAvatarSelect,
    handleCropComplete,
    handleImageUpload,
    handleCloseCropModal,
    handleUploadButtonClick,
    imagePreview,
    isConvertingAvatar,
    isDisabled,
    isPopoverOpen,
    isProcessing,
    isUploading,
    selectedFile,
    setIsPopoverOpen,
    showCropModal,
  } = useAvatarSelectionPopover({
    initialImage,
    onImageUpdate,
    isSquareLogo,
  });

  const getTooltipContentElement = () => {
    return (
      <Typography variant={'caption-12-medium'} textColor={'white'}>
        {tooltipText || `Please upload the ${isSquareLogo ? 'Avatar' : 'Image'}`}
      </Typography>
    );
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                e.preventDefault();
                setIsPopoverOpen(true);
              }
            }}
          >
            {imagePreview ? (
              <ImagePreviewComponent
                imagePreview={imagePreview}
                isSquareLogo={isSquareLogo}
                isUploading={isUploading || isProcessing || isConvertingAvatar}
              />
            ) : (
              <TooltipWrapperDark
                showTooltip={!imagePreview && !isPopoverOpen}
                trigger={
                  <UploadPlaceholderComponent
                    isUploading={isUploading || isProcessing || isConvertingAvatar}
                    isSquareLogo={isSquareLogo}
                  />
                }
                content={getTooltipContentElement()}
                tooltipAlign="center"
                tooltipSideOffsetValue={32}
                showArrow={false}
                alwaysVisible={false}
              />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-96 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
          align="center"
          sideOffset={8}
        >
          <div className="flex flex-col gap-4">
            {/* Avatar Grid */}
            <div className="hide-scrollbar grid max-h-80 grid-cols-5 gap-3 overflow-auto p-2">
              {avatarComponents.map((AvatarComponent, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    'flex cursor-pointer items-center justify-center rounded-lg border border-gray-200 transition-all hover:shadow-md hover:ring-2 hover:ring-primary/60',
                    {
                      'cursor-not-allowed opacity-50': isUploading || isConvertingAvatar,
                    },
                  )}
                  onClick={() => handleAvatarSelect(AvatarComponent)}
                  disabled={isUploading || isConvertingAvatar}
                  aria-label={`Select avatar ${index + 1}`}
                >
                  <AvatarComponent className="h-full w-full rounded-lg" />
                </button>
              ))}
            </div>

            {/* Upload Picture Button */}
            <div className="flex w-full justify-end">
              <Button
                variant="system_secondary"
                buttonStyle="rightIcon"
                rightIcon={<UploadPictureIcon color="black" />}
                onClick={handleUploadButtonClick}
                disabled={isUploading || isConvertingAvatar}
              >
                {isUploading || isConvertingAvatar ? 'Uploading...' : 'Upload Picture'}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onClick={() => {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        onChange={handleImageUpload}
        disabled={isDisabled}
      />

      {/* Image Crop Modal */}
      <ReactCropperModal
        isOpen={showCropModal}
        onClose={handleCloseCropModal}
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        outputWidth={cropOutputWidth}
        outputHeight={cropOutputHeight}
        outputMimeType={cropOutputMimeType}
      />
    </>
  );
};

export default AvatarSelectionPopover;
