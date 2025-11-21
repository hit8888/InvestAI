import DefaultProfileImage from '@breakout/design-system/components/icons/DefaultProfileImage';
import Card from '../../components/AgentManagement/Card';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import UploadPictureIcon from '@breakout/design-system/components/icons/upload-picture-icon';
import ReactCropperModal from '../../components/AgentManagement/ReactCropperModal';
import { useImageCropModal } from '../../hooks/useImageCropModal';
import { Dialog, DialogContent, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';

interface ProfilePictureProps {
  profileImageUrl?: string;
  onUpload?: (file: Blob) => void;
  onDelete?: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
}

const ProfilePicture = ({ profileImageUrl, onUpload, onDelete, isUploading, isDeleting }: ProfilePictureProps) => {
  return (
    <Card>
      <div className="flex items-center gap-6 self-stretch">
        {profileImageUrl ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full ">
            <img
              src={profileImageUrl}
              alt="Profile picture"
              className="h-full w-full rounded-full  ring-2 ring-gray-100"
            />
          </div>
        ) : (
          <DefaultProfileImage />
        )}
        <div className="flex flex-1 flex-col items-start justify-center gap-4">
          <div className="flex flex-col items-start gap-2">
            <Typography variant="label-16-medium">Profile picture</Typography>
            <Typography variant="caption-12-normal" textColor="gray500">
              We only support PNGs, JPEGs and GIFs under 5MB
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <UploadPictureButton onUpload={onUpload} isUploading={isUploading} />
            <DeleteProfilePicButton onDelete={onDelete} isDeleting={isDeleting} hasProfilePicture={!!profileImageUrl} />
          </div>
        </div>
      </div>
    </Card>
  );
};

interface UploadPictureButtonProps {
  onUpload?: (file: Blob) => void;
  isUploading?: boolean;
}

const UploadPictureButton = ({ onUpload, isUploading }: UploadPictureButtonProps) => {
  const {
    selectedFile,
    showCropModal,
    fileInputRef,
    triggerFileInput,
    handleImageUpload,
    handleCropComplete,
    handleCloseCropModal,
  } = useImageCropModal({
    onCropComplete: async (croppedImageBlob) => {
      if (onUpload) {
        onUpload(croppedImageBlob);
      }
    },
    disabled: isUploading || false,
  });
  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />

      <ReactCropperModal
        isOpen={showCropModal}
        onClose={handleCloseCropModal}
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        outputWidth={84}
        outputHeight={84}
        outputMimeType={selectedFile?.type || 'image/png'}
      />
      <Button
        id="profile-upload-picture-button"
        variant="primary"
        buttonStyle="leftIcon"
        leftIcon={<UploadPictureIcon />}
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Picture'}
      </Button>
    </>
  );
};

interface DeleteProfilePicButtonProps {
  onDelete?: () => void;
  isDeleting?: boolean;
  hasProfilePicture?: boolean;
}

const DeleteProfilePicButton = ({ onDelete, isDeleting, hasProfilePicture }: DeleteProfilePicButtonProps) => {
  const [showDeleteProfilePicDialog, setShowDeleteProfilePicDialog] = useState(false);

  const handleCloseDeleteProfilePicDialog = () => {
    setShowDeleteProfilePicDialog(false);
  };

  const handleDeleteProfilePic = () => {
    setShowDeleteProfilePicDialog(false);
    if (onDelete) {
      onDelete();
    }
  };

  // Don't show delete button if there's no profile picture
  if (!hasProfilePicture) {
    return null;
  }

  return (
    <Dialog open={showDeleteProfilePicDialog} onOpenChange={setShowDeleteProfilePicDialog}>
      <DialogTrigger asChild>
        <Button
          id="profile-delete-picture-button"
          variant="destructive_tertiary"
          buttonStyle="icon"
          leftIcon={<DeleteIcon />}
          disabled={isDeleting}
        ></Button>
      </DialogTrigger>
      <DialogContent className="fixed left-1/2 top-1/2 max-w-[420px] -translate-x-1/2 -translate-y-1/2 !gap-6 !rounded-2xl border border-gray-300 bg-white p-6 shadow-2xl">
        <div className="flex w-full flex-col gap-1">
          <Typography variant="title-24" align={'center'}>
            Delete profile picture?
          </Typography>
          <Typography variant="body-16" align={'center'} textColor="gray500">
            You're about to remove the uploaded profile picture. This action cannot be undone.
          </Typography>
        </div>
        <div className="mt-2 flex w-full justify-between gap-6">
          <Button
            id="profile-delete-picture-cancel-button"
            className="w-full"
            variant="secondary"
            onClick={handleCloseDeleteProfilePicDialog}
          >
            Cancel
          </Button>
          <Button
            id="profile-delete-picture-confirm-button"
            className="w-full"
            variant="destructive"
            buttonStyle="rightIcon"
            rightIcon={<DeleteIcon />}
            onClick={handleDeleteProfilePic}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicture;
