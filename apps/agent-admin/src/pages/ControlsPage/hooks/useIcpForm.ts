import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICPFormData, ICP_INITIAL_DATA, icpFormSchema } from '../utils';
import { trackError } from '@meaku/core/utils/error';

export const useIcpForm = (
  transformedFormData: ICPFormData | null,
  saveIcpConfig: (data: ICPFormData, dirtyFields: Record<string, boolean>) => Promise<void>,
) => {
  // React Hook Form setup with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    reset,
    setValue,
  } = useForm<ICPFormData>({
    // @ts-ignore - Type instantiation is excessively deep with zodResolver and complex schemas
    resolver: zodResolver(icpFormSchema),
    defaultValues: ICP_INITIAL_DATA,
    mode: 'onChange',
  });

  // Transform API data to form data when config is loaded
  useEffect(() => {
    if (transformedFormData) {
      // reset() with new values will update the form's values and reset its dirty state.
      reset(transformedFormData);
    }
  }, [transformedFormData, setValue, reset]);

  // Memoized submit handler
  const onSubmit = useCallback(
    async (data: ICPFormData) => {
      // Check if any fields have actually changed
      const hasRealChanges = Object.keys(dirtyFields).length > 0;
      if (!hasRealChanges) {
        return;
      }

      try {
        await saveIcpConfig(data, dirtyFields as Record<string, boolean>);
        // Reset form after successful save to mark as not dirty
        reset(data);
      } catch (error) {
        trackError(error, {
          action: 'Assign SDR Api call',
          component: 'AssignRepValue function',
          additionalData: {
            errorMessage: 'Unable to save ICP config',
          },
        });
        throw error; // Re-throw to allow parent component to handle
      }
    },
    [dirtyFields, saveIcpConfig, reset],
  );

  // Check if form can be saved
  const canSave = isDirty && Object.keys(dirtyFields).length > 0;

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isDirty,
    dirtyFields,
    canSave,
  };
};
