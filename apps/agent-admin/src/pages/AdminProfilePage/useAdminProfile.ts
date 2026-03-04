import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UpdateUserProfilePayload } from '@neuraltrade/core/types/admin/api';
import { uploadAssetsFile } from '@neuraltrade/core/adminHttp/api';
import { useSessionStore } from '../../stores/useSessionStore';
import useUpdateUserProfileMutation from '../../queries/mutation/useUpdateUserProfileMutation';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { checkFileSize } from '../../utils/common';
import { THREE_HUNDRED_MB } from '../../utils/constants';

// Form schema for validation
const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  designation: z.string().min(1, 'Designation is required'),
  profilePicture: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const useAdminProfile = () => {
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState(false);

  const userInfo = useSessionStore((state) => state.userInfo);
  const updateUserInfo = useSessionStore((state) => state.updateUserInfo);

  // React Hook Form setup
  const form = useForm<ProfileFormData>({
    // @ts-ignore - Type instantiation is excessively deep with zodResolver and complex schemas
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      designation: '',
      profilePicture: '',
    },
  });

  const { reset, watch, getValues, formState } = form;
  const { dirtyFields } = formState;

  // Watch all form values to detect changes
  const watchedValues = watch();

  // Update user profile mutation
  const updateUserProfileMutation = useUpdateUserProfileMutation({
    onSuccess: (data) => {
      SuccessToastMessage({
        title: 'Profile updated successfully',
      });

      updateUserInfo({
        first_name: data.first_name,
        last_name: data.last_name,
        designation: data.designation ?? null,
        profile_picture: data.profile_picture ?? '',
      });
    },
    onError: (error) => {
      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.response?.data) {
        const errorData = error.response.data;

        if ('details' in errorData && typeof errorData.details === 'object') {
          // Validation errors
          const validationErrors = Object.entries(errorData.details)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('; ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else if ('error' in errorData) {
          errorMessage = errorData.error;
        }
      }
      ErrorToastMessage({
        title: errorMessage,
      });
    },
  });

  // Update form data when user profile is loaded
  useEffect(() => {
    if (userInfo) {
      const formData = {
        firstName: userInfo.first_name || '',
        lastName: userInfo.last_name || '',
        designation: userInfo.designation || '',
        profilePicture: userInfo.profile_picture || '',
      };

      reset(formData);
    }
  }, [userInfo, reset]);

  // Check if there are actual changes in text fields only
  const hasTextFieldChanges = () => {
    // Check if any of the text fields are dirty (excluding profilePicture)
    return !!(dirtyFields.firstName || dirtyFields.lastName || dirtyFields.designation);
  };

  // Check if profile picture has changed
  const hasProfilePictureChanges = () => {
    return !!dirtyFields.profilePicture;
  };

  const handleSaveProfileDetails = () => {
    // Check if there are any changes in text fields
    if (!hasTextFieldChanges()) {
      ErrorToastMessage({
        title: 'No changes detected to save.',
      });
      return;
    }

    const currentValues = getValues();

    // Prepare payload with only changed text fields
    const payload: UpdateUserProfilePayload = {};

    if (dirtyFields.firstName) {
      payload.first_name = currentValues.firstName;
    }
    if (dirtyFields.lastName) {
      payload.last_name = currentValues.lastName;
    }
    if (dirtyFields.designation) {
      payload.designation = currentValues.designation;
    }

    updateUserProfileMutation.mutate({ data: payload });
  };

  const handleProfilePictureUpload = async (file: Blob) => {
    try {
      setIsUploadingProfilePicture(true);

      // Convert blob to file
      const croppedFile = new File([file], 'profile-picture.png', {
        type: 'image/png',
      });

      const { status, error } = checkFileSize(croppedFile, THREE_HUNDRED_MB);
      if (!status) {
        ErrorToastMessage({
          title: error || '',
        });
        return;
      }

      const response = await uploadAssetsFile(croppedFile);
      const assetData = response.data as { public_url: string };

      // Update profile with new profile picture URL
      const payload: UpdateUserProfilePayload = {
        profile_picture: assetData.public_url,
      };

      updateUserProfileMutation.mutate({ data: payload });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      ErrorToastMessage({
        title: 'Failed to upload profile picture. Please try again.',
      });
    } finally {
      setIsUploadingProfilePicture(false);
    }
  };

  const handleProfilePictureDelete = () => {
    // Update profile to remove profile picture
    const payload: UpdateUserProfilePayload = {
      profile_picture: '',
    };

    updateUserProfileMutation.mutate({ data: payload });
  };

  return {
    // Form methods
    form,

    // Loading states
    isLoading: false,
    isUploadingProfilePicture,
    isSaving: updateUserProfileMutation.isPending,

    // Form data
    profileData: watchedValues,

    // Change detection
    hasChanges: hasTextFieldChanges(),
    hasProfilePictureChanges: hasProfilePictureChanges(),

    // Handlers
    handleSaveProfileDetails,
    handleProfilePictureUpload,
    handleProfilePictureDelete,
  };
};
