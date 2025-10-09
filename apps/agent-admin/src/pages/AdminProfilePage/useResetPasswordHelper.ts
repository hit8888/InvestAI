import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import useChangePasswordMutation from '../../queries/mutation/useChangePasswordMutation';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';

// Validation schema
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().trim().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;

const useResetPasswordHelper = () => {
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  const form = useForm<PasswordFormData>({
    // @ts-expect-error - Type instantiation is excessively deep with zodResolver and complex schemas
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const changePasswordMutation = useChangePasswordMutation({
    onSuccess: (response) => {
      SuccessToastMessage({
        title: response.data.message || 'Password changed successfully',
      });
      handleCloseDialog();
    },
    onError: (
      error: AxiosError<{
        confirm_password?: string[];
        new_password?: string[];
      }>,
    ) => {
      const errorData = error.response?.data;
      if (errorData) {
        // Set server-side validation errors
        if (errorData.new_password?.[0]) {
          form.setError('newPassword', {
            type: 'server',
            message: errorData.new_password[0],
          });
        }
        if (errorData.confirm_password?.[0]) {
          form.setError('confirmPassword', {
            type: 'server',
            message: errorData.confirm_password[0],
          });
        }
      } else {
        ErrorToastMessage({
          title: 'Failed to change password. Please try again.',
        });
      }
    },
  });

  const handleCloseDialog = () => {
    setShowResetPasswordDialog(false);
    form.reset();
    form.clearErrors();
  };

  const handleSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    });
  };

  const onSubmit = form.handleSubmit(handleSubmit);

  // Watch form values for real-time updates
  const watchedValues = form.watch();

  // Helper to check if form can be submitted
  const canSubmit = () => {
    const values = watchedValues;
    return (
      values.newPassword?.trim() &&
      values.confirmPassword?.trim() &&
      values.newPassword.trim().length >= 8 &&
      values.newPassword.trim() === values.confirmPassword.trim()
    );
  };

  return {
    // Dialog state
    showResetPasswordDialog,
    setShowResetPasswordDialog,
    handleCloseDialog,

    // Form state and methods
    form,
    onSubmit,

    // Mutation state
    isLoading: changePasswordMutation.isPending,

    // Form field helpers
    register: form.register,
    formState: form.formState,
    getFieldError: (fieldName: keyof PasswordFormData) => form.formState.errors[fieldName]?.message,
    canSubmit,
  };
};

export default useResetPasswordHelper;
