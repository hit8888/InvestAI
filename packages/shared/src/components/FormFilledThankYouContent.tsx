import { useMemo } from 'react';
import { LucideIcon, Typography } from '@meaku/saral';
import { FormFieldSchemaType } from '../utils/artifact';

type FormFilledThankYouContentProps = {
  formFields: FormFieldSchemaType[];
  formValues: Record<string, string> | undefined;
};

const FormFilledThankYouContent = ({ formFields, formValues }: FormFilledThankYouContentProps) => {
  const formFilledLabelAndValues = useMemo(() => {
    return formFields
      .map((field) => {
        const fieldValue = formValues?.[field.field_name];
        const hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';

        if (!hasValue) return null;

        return (
          <div key={field.field_name} className="flex w-full items-center gap-1">
            <Typography variant="body" className="font-medium text-gray-500">
              {field.label}:
            </Typography>
            <Typography variant="body" className="max-w-full truncate font-medium text-gray-900">
              {fieldValue}
            </Typography>
          </div>
        );
      })
      .filter(Boolean); // Remove null values
  }, [formFields, formValues]);

  const hasFormFilledValues = formFilledLabelAndValues.length > 0;

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-full border-[16px] border-green-100 bg-green-500 p-2">
          <LucideIcon name="check" className="stroke-4 size-5 text-background" />
        </div>
        <Typography variant="heading-xl" className="text-center font-medium">
          Details Submitted
        </Typography>
        {hasFormFilledValues && <div className="flex flex-col gap-1 p-4">{formFilledLabelAndValues}</div>}
      </div>
    </div>
  );
};

export default FormFilledThankYouContent;
