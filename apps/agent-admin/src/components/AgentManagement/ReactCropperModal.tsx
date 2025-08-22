import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@breakout/design-system/components/layout/dialog';

interface ReactCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  outputWidth?: number;
  outputHeight?: number;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

const ReactCropperModal: React.FC<ReactCropperModalProps> = ({
  isOpen,
  onClose,
  imageFile,
  onCropComplete,
  outputWidth = 240,
  outputHeight = 60,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cropperRef = useRef<any>(null);

  const imageUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleZoomChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(event.target.value);
    setZoomLevel(newZoom);

    if (cropperRef.current?.cropper) {
      cropperRef.current.cropper.zoomTo(newZoom);
    }
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);
    try {
      const cropper = cropperRef.current?.cropper;
      const isSquare = outputWidth === outputHeight;
      const exportWidth = isSquare ? Math.max(256, outputWidth * 4) : outputWidth * 2;
      const exportHeight = isSquare ? exportWidth : outputHeight * 2;

      const exportedCanvas = cropper.getCroppedCanvas({
        width: exportWidth,
        height: exportHeight,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        fillColor: 'transparent',
      });

      if (!exportedCanvas) {
        console.error('Could not export cropped canvas');
        return;
      }

      exportedCanvas.toBlob(
        (blob: Blob | null) => {
          if (blob) {
            onCropComplete(blob);
            onClose();
          }
        },
        'image/png',
        1.0,
      );
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onCropComplete, onClose, outputWidth, outputHeight]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleCancel();
      }
    },
    [handleCancel],
  );

  const handleCropperReady = useCallback(() => {
    // Zoom out to fit the image in the container
    if (cropperRef.current && cropperRef.current.cropper) {
      const cropper = cropperRef.current.cropper;
      // Get container and image data
      const containerData = cropper.getContainerData();
      const imageData = cropper.getImageData();

      // Calculate the scale to fit the image in 80% of the container
      const scaleX = (containerData.width * 0.8) / imageData.naturalWidth;
      const scaleY = (containerData.height * 0.8) / imageData.naturalHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

      // Set the initial zoom to fit the image
      cropper.zoomTo(scale);
      setZoomLevel(scale);
    }
  }, []);

  if (!isOpen || !imageFile || !imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>
            Crop Image ({outputWidth}x{outputHeight})
          </DialogTitle>
        </DialogHeader>

        {/* Crop Container */}
        <div
          className="mb-4 h-96 w-full bg-transparent"
          style={{
            backgroundImage: `
            linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.1) 75%)
          `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          <Cropper
            ref={cropperRef}
            src={imageUrl}
            style={{ height: 384, width: '100%' }}
            aspectRatio={outputWidth / outputHeight}
            viewMode={0} // Allow crop box to extend beyond image boundaries
            dragMode="move"
            autoCropArea={0.9} // Increase to create crop box around the image
            restore={false}
            guides={true}
            center={true}
            highlight={false}
            cropBoxMovable={true}
            cropBoxResizable={true}
            toggleDragModeOnDblclick={false}
            zoomable={true}
            zoomOnWheel={true}
            wheelZoomRatio={0.1}
            minCropBoxWidth={1}
            minCropBoxHeight={1}
            background={false} // Set to false for transparent background
            responsive={true}
            checkCrossOrigin={false}
            ready={handleCropperReady}
          />
        </div>

        {/* Zoom Slider */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={zoomLevel}
            onChange={handleZoomChange}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-lg [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-lg [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-track]:h-2 [&::-webkit-slider-track]:rounded-lg"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((zoomLevel - 0.1) / (3 - 0.1)) * 100}%, #9ca3af ${((zoomLevel - 0.1) / (3 - 0.1)) * 100}%, #9ca3af 100%)`,
            }}
          />
        </div>

        {/* Instructions */}
        <div className="mb-4 rounded-md p-2">
          <Typography variant="body-14" textColor="gray500">
            • Drag to move the image • Use slider to zoom • Resize the crop box • The crop area will be {outputWidth}x
            {outputHeight} pixels
          </Typography>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCropConfirm} disabled={isProcessing}>
            {isProcessing ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReactCropperModal;
