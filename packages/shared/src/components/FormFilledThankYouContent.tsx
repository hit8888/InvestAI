import { useMemo } from 'react';
import { Typography } from '@meaku/saral';
import { CheckIcon } from 'lucide-react';
import { FormFieldSchemaType } from '../utils/artifact';

type FormFilledThankYouContentProps = {
  formFields: FormFieldSchemaType[];
  formValues: Record<string, string>;
  showSteps?: boolean;
  className?: string;
};

const FormFilledThankYouContent = ({
  formFields,
  formValues,
  showSteps,
  className = '',
}: FormFilledThankYouContentProps) => {
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
    <div className={`w-full ${className}`}>
      {showSteps && (
        <Typography className="mb-2 font-medium text-primary" variant="body-small">
          Step 1 of 2
        </Typography>
      )}
      <div className="relative flex h-full flex-1 flex-col items-start items-center justify-center gap-4">
        <div className="absolute -bottom-2 -left-3 -right-3 top-0 z-10 bg-gradient-to-b from-black/15 to-black/20" />
        <div className="relative z-10 z-20 mb-2 mt-3 flex w-full flex-col rounded-xl bg-background">
          <div className="bg-positive-light flex w-full items-start justify-start gap-2 rounded-xl p-3">
            <div className="flex items-center justify-center rounded-full bg-white/20 p-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white p-1">
                <CheckIcon className="text-positive-dark h-6 w-6" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="heading" className="text-white">
                Thank you for sharing your details!
              </Typography>
              <Typography variant="body-small" className="text-white/70">
                Info Submitted! Let me know if you have any questions or need help.
              </Typography>
            </div>
          </div>

          {hasFormFilledValues && <div className="flex flex-col gap-1 p-4">{formFilledLabelAndValues}</div>}
        </div>
      </div>
    </div>
  );
};

export default FormFilledThankYouContent;
