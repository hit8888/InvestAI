import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentType, Dispatch, MouseEvent, SetStateAction } from 'react';
import { createRoot } from 'react-dom/client';

import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { uploadAssetsFile } from '@meaku/core/adminHttp/api';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { trackError } from '@meaku/core/utils/error';

import { useImageCropModal } from '../../hooks/useImageCropModal';
import { checkFileSize } from '../../utils/common';
import {
  THREE_HUNDRED_MB,
  SQUARE_AVATAR_DIMENSION,
  RECT_AVATAR_HEIGHT,
  RECT_AVATAR_WIDTH,
} from '../../utils/constants';
import * as AvatarAssets from '../../assets/avatars-asset/index';
import useSessionStore from '../../stores/useSessionStore/useSessionStore';

export interface AvatarComponentProps {
  className?: string;
  size?: number;
}

interface AssetResponse {
  id: string;
  name: string;
  type: string;
  description: string;
  key: string;
  public_url: string;
}

export interface AvatarSelectionPopoverProps {
  width: string;
  height: string;
  isSquareLogo?: boolean;
  initialImage?: string | null;
  onImageUpdate?: (image: string, assetData?: AssetResponse) => void;
  tooltipText?: string;
}

interface UseAvatarSelectionPopoverParams {
  initialImage?: string | null;
  onImageUpdate?: (image: string, assetData?: AssetResponse) => void;
  isSquareLogo?: boolean;
}

interface UseAvatarSelectionPopoverReturn {
  avatarComponents: Array<ComponentType<AvatarComponentProps>>;
  cropOutputHeight: number;
  cropOutputMimeType: string;
  cropOutputWidth: number;
  fileInputRef: ReturnType<typeof useImageCropModal>['fileInputRef'];
  handleAvatarSelect: (AvatarComponent: ComponentType<AvatarComponentProps>) => Promise<void>;
  handleCropComplete: ReturnType<typeof useImageCropModal>['handleCropComplete'];
  handleImageUpload: ReturnType<typeof useImageCropModal>['handleImageUpload'];
  handleCloseCropModal: ReturnType<typeof useImageCropModal>['handleCloseCropModal'];
  handleUploadButtonClick: (event: MouseEvent<HTMLButtonElement>) => void;
  imagePreview: string | null;
  isConvertingAvatar: boolean;
  isDisabled: boolean;
  isPopoverOpen: boolean;
  isProcessing: boolean;
  isUploading: boolean;
  selectedFile: ReturnType<typeof useImageCropModal>['selectedFile'];
  setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;
  showCropModal: boolean;
}

const AVATAR_COMPONENTS: ComponentType<AvatarComponentProps>[] = Object.values(AvatarAssets);

const convertAvatarComponentToBlob = async (
  AvatarComponent: ComponentType<AvatarComponentProps>,
  size: number = 60,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      container.style.visibility = 'hidden';
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(createElement(AvatarComponent, { size }));

      const checkAndConvert = () => {
        requestAnimationFrame(() => {
          try {
            const svgElement = container.querySelector('svg');
            if (!svgElement) {
              setTimeout(checkAndConvert, 50);
              return;
            }

            const clonedSvg = svgElement.cloneNode(true) as SVGElement;
            clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

            const svgString = new XMLSerializer().serializeToString(clonedSvg);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            const img = new Image();

            img.onload = () => {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  throw new Error('Could not get canvas context');
                }

                ctx.drawImage(img, 0, 0, size, size);

                canvas.toBlob(
                  (blob) => {
                    URL.revokeObjectURL(svgUrl);
                    document.body.removeChild(container);
                    root.unmount();

                    if (blob) {
                      resolve(blob);
                    } else {
                      reject(new Error('Failed to convert canvas to blob'));
                    }
                  },
                  'image/png',
                  1.0,
                );
              } catch (error) {
                URL.revokeObjectURL(svgUrl);
                document.body.removeChild(container);
                root.unmount();
                reject(error);
              }
            };

            img.onerror = () => {
              URL.revokeObjectURL(svgUrl);
              document.body.removeChild(container);
              root.unmount();
              reject(new Error('Failed to load SVG as image'));
            };

            img.src = svgUrl;
          } catch (error) {
            document.body.removeChild(container);
            root.unmount();
            reject(error);
          }
        });
      };

      checkAndConvert();
    } catch (error) {
      reject(error);
    }
  });
};

export const useAvatarSelectionPopover = ({
  initialImage,
  onImageUpdate,
  isSquareLogo,
}: UseAvatarSelectionPopoverParams): UseAvatarSelectionPopoverReturn => {
  const activeTenant = useSessionStore((state) => state.activeTenant);
  const agentId = activeTenant?.agentId ?? 1;
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isConvertingAvatar, setIsConvertingAvatar] = useState(false);
  const selectedFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (initialImage && initialImage.length > 0) {
      setImagePreview(initialImage ?? null);
    }
  }, [initialImage]);

  const handleAvatarSelect = useCallback(
    async (AvatarComponent: ComponentType<AvatarComponentProps>) => {
      try {
        setIsConvertingAvatar(true);
        setIsUploading(true);

        const blob = await convertAvatarComponentToBlob(AvatarComponent, 60);

        const avatarFile = new File([blob], 'avatar.png', {
          type: 'image/png',
        });

        const { status, error } = checkFileSize(avatarFile, THREE_HUNDRED_MB);
        if (!status) {
          ErrorToastMessage({
            title: error || '',
          });
          return;
        }

        const response = await uploadAssetsFile(avatarFile);
        const assetData = response.data as AssetResponse;

        setImagePreview(assetData.public_url);
        onImageUpdate?.(assetData.public_url, assetData);
        setIsPopoverOpen(false);
      } catch (error) {
        console.error('Error uploading avatar:', error);
        ErrorToastMessage({
          title: 'Avatar unable to upload, error has been reported.',
        });
        trackError(error, {
          action: 'AvatarSelectionPopover Api call',
          component: 'AvatarSelectionPopover function',
          additionalData: {
            agentId,
            tenantName: getTenantIdentifier()?.['tenant-name'],
            errorMessage: 'Unable to upload Avatar',
          },
        });
      } finally {
        setIsUploading(false);
        setIsConvertingAvatar(false);
      }
    },
    [agentId, onImageUpdate],
  );

  const handleCropCompleteInternal = useCallback(
    async (croppedImageBlob: Blob) => {
      try {
        setIsUploading(true);

        const currentSelectedFile = selectedFileRef.current;
        const originalFileName = currentSelectedFile?.name || 'cropped-image.png';
        const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        const fileType = currentSelectedFile?.type || 'image/png';

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

        setImagePreview(assetData.public_url);
        onImageUpdate?.(assetData.public_url, assetData);
        setIsPopoverOpen(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        ErrorToastMessage({
          title: 'Image unable to upload, error has been reported.',
        });
        trackError(error, {
          action: 'AvatarSelectionPopover Api call',
          component: 'AvatarSelectionPopover function',
          additionalData: {
            agentId,
            tenantName: getTenantIdentifier()?.['tenant-name'],
            errorMessage: 'Unable to upload Image',
          },
        });
      } finally {
        setIsUploading(false);
      }
    },
    [agentId, onImageUpdate],
  );

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

  useEffect(() => {
    selectedFileRef.current = selectedFile ?? null;
  }, [selectedFile]);

  const handleUploadButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setIsPopoverOpen(false);
      triggerFileInput();
    },
    [triggerFileInput],
  );

  const isDisabled = isUploading || showCropModal || isProcessing || isConvertingAvatar;

  return {
    avatarComponents: AVATAR_COMPONENTS,
    cropOutputHeight: isSquareLogo ? SQUARE_AVATAR_DIMENSION : RECT_AVATAR_HEIGHT,
    cropOutputMimeType: selectedFile?.type || 'image/png',
    cropOutputWidth: isSquareLogo ? SQUARE_AVATAR_DIMENSION : RECT_AVATAR_WIDTH,
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
  };
};
