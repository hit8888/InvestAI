import PromptHeader from './PromptHeader';
import { CommonControlsProps, SUPPORT_CONFIG, createSupportFormSchema, SupportFormData } from './utils';
import { useEffect, useMemo, useState } from 'react';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import LoadingState from './LoadingState';
import FilledSupportData from './FilledSupportData';
import SupportForm from './SupportForm';
import useTenantMetadataMutation from '../../queries/mutation/useTenantMetadataMutation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { deepCompare } from '@meaku/core/utils/index';

type ICheckedFields = {
  email: boolean;
  phone: boolean;
  website_url: boolean;
};

interface AgentSupportSystemProps extends CommonControlsProps {
  isLoading: boolean;
  error: Error | null;
  support: SupportFormData;
}

const AgentSupportSystem = ({ title, description, isLoading, error, support }: AgentSupportSystemProps) => {
  const [checkedFields, setCheckedFields] = useState<ICheckedFields>({
    email: false,
    phone: false,
    website_url: false,
  });
  const [clickOnEdit, setClickOnEdit] = useState(false);
  const [originalSavedData, setOriginalSavedData] = useState<Record<string, string>>({});

  // Mutation hook for updating tenant metadata
  const updateTenantMetadata = useTenantMetadataMutation();

  // React Hook Form setup with zodResolver
  const {
    control,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
    reset,
    trigger,
    setError,
  } = useForm<SupportFormData>({
    defaultValues: {
      email: '',
      phone: '',
      website_url: '',
    },
    mode: 'onBlur',
  });

  const watchedValues = watch();

  const getOriginalDataAndSavedFieldsValues = (values: string[], data: SupportFormData) => {
    // Store original values and update checked data
    const originalValues: Record<string, string> = {};
    const savedFields: string[] = [];

    values.forEach((key) => {
      const value = data[key as keyof typeof data];
      if (value) {
        savedFields.push(key);
        originalValues[key as keyof typeof data] = value;
      }
    });

    return { originalValues, savedFields };
  };

  // Initialize form and state when support data are loaded
  useEffect(() => {
    if (Object.keys(support).length > 0) {
      // Set form values
      reset(support);

      const { originalValues, savedFields } = getOriginalDataAndSavedFieldsValues(Object.keys(support), support);

      // Set checked fields based on saved data
      const newCheckedFields: ICheckedFields = {
        email: savedFields.includes('email'),
        phone: savedFields.includes('phone'),
        website_url: savedFields.includes('website_url'),
      };
      setCheckedFields(newCheckedFields);
      setOriginalSavedData(originalValues);
    }
  }, [support, reset]);

  const handleCheckboxChange = (key: keyof SupportFormData) => {
    setCheckedFields((prev) => {
      const newCheckedFields = { ...prev, [key]: !prev[key] };

      // Clear validation error when unchecking (when the new value becomes false)
      if (!newCheckedFields[key]) {
        clearErrors(key);
      } else {
        // Trigger validation for the field when checking it
        setTimeout(() => {
          trigger(key);
        }, 0);
      }

      return newCheckedFields;
    });
  };

  const onSubmit = async (data: SupportFormData) => {
    // Validate using Zod schema
    const schema = createSupportFormSchema(checkedFields);
    const result = schema.safeParse(data);

    if (!result.success) {
      // Set validation errors
      result.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof SupportFormData;
        setError(fieldName, { message: error.message });
      });
      return;
    }

    const fieldsToSave: string[] = [];
    const dataToSave: Record<string, string> = {};

    // Prepare data to save from checked fields
    for (const config of SUPPORT_CONFIG) {
      const key = config.id as keyof SupportFormData;

      if (checkedFields[key]) {
        const value = data[key];
        if (value) {
          fieldsToSave.push(key);
          dataToSave[key] = value;
        }
      }
    }

    // Compare with original data (only saved fields)
    if (deepCompare(dataToSave, originalSavedData)) {
      setClickOnEdit(false);
      return;
    }

    try {
      // Call API to save support data
      await updateTenantMetadata.mutateAsync({
        data: {
          support: dataToSave,
        },
      });

      // Update the original saved data
      setOriginalSavedData({ ...dataToSave });

      // Update checked fields to only include saved fields
      const newCheckedFields: ICheckedFields = {
        email: fieldsToSave.includes('email'),
        phone: fieldsToSave.includes('phone'),
        website_url: fieldsToSave.includes('website_url'),
      };
      setCheckedFields(newCheckedFields);
      setClickOnEdit(false);
      toast.success('Support data saved successfully');
    } catch (error) {
      toast.error('Error saving support data');
      console.error('Error saving support data:', error);
    }
  };

  const handleEdit = () => {
    setClickOnEdit(true);
    // Set checked fields to include saved fields
    const editCheckedFields: ICheckedFields = {
      email: Object.keys(originalSavedData).includes('email'),
      phone: Object.keys(originalSavedData).includes('phone'),
      website_url: Object.keys(originalSavedData).includes('website_url'),
    };
    setCheckedFields(editCheckedFields);
    // Restore form data with current support values (which includes both saved and unsaved data)
    reset({
      email: originalSavedData.email || '',
      phone: originalSavedData.phone || '',
      website_url: originalSavedData.website_url || '',
    });
  };

  const isFormValid = SUPPORT_CONFIG.some((config) => {
    const key = config.id as keyof SupportFormData;
    const value = watchedValues[key];
    const error = errors[key];
    const isChecked = checkedFields[key];
    return isChecked && value !== '' && !error;
  });

  const anyCheckboxChecked = Object.values(checkedFields).some(Boolean);

  const originalValuesAllFilled = useMemo(
    () => Object.keys(originalSavedData).length > 0 && Object.values(originalSavedData).every((value) => value !== ''),
    [originalSavedData],
  );

  const showOriginalSupportData = !clickOnEdit && originalValuesAllFilled;

  if (isLoading) {
    return <LoadingState title={title} description={description} />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      {showOriginalSupportData ? (
        <FilledSupportData supportData={originalSavedData} handleEdit={handleEdit} />
      ) : (
        <SupportForm
          control={control}
          handleSubmit={handleSubmit(onSubmit)}
          handleCheckboxChange={handleCheckboxChange}
          checkedFields={checkedFields}
          errors={errors}
          showSubmitButton={anyCheckboxChecked}
          isSubmitBtnDisabled={!isFormValid || updateTenantMetadata.isPending}
        />
      )}
    </div>
  );
};

export default AgentSupportSystem;
