import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import CardHeader from '@breakout/design-system/components/layout/card-header';
import CardTitle from './card-title';
import CardDescription from './card-description';
// import { PencilIcon } from 'lucide-react';
// import Button from './button';
import { FormArtifactMetadataType, FormFieldSchemaType } from '@meaku/core/types/artifact';
import Typography from '../Typography';
import { useMemo } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

type FormFilledThankYouContentProps = {
  formFields: FormFieldSchemaType[];
  formValues: FormArtifactMetadataType;
  steps?: number;
  // handleEdit: () => void;
  // isformDisabled?: boolean;
};

const FormFilledThankYouContent = ({
  formFields,
  formValues,
  steps,
  // handleEdit,
  // isformDisabled,
}: FormFilledThankYouContentProps) => {
  const isMobile = useIsMobile();

  const formFilledLabelAndValues = useMemo(() => {
    return formFields
      .map((field) => {
        const fieldValue = formValues.filled_data?.[field.field_name];
        const hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';

        if (!hasValue) return null;

        return (
          <div key={field.field_name} className="flex w-full items-center gap-2">
            <Typography variant="label-14-medium" textColor="default">
              {field.label}:
            </Typography>
            <Typography variant="body-14" textColor="textSecondary" className="max-w-full truncate">
              {fieldValue}
            </Typography>
          </div>
        );
      })
      .filter(Boolean); // Remove null values
  }, [formFields, formValues.filled_data]);

  const hasFormFilledValues = formFilledLabelAndValues.length > 0;

  return (
    <Card
      className={cn('w-full max-w-[404px] rounded-2xl border-none bg-transparent_gray_3', {
        'max-w-full': isMobile,
      })}
    >
      <CardContent className="flex flex-col gap-4 p-4">
        {steps && <Typography variant="label-16-semibold" textColor="gray500">{`1 of 2`}</Typography>}
        <div className="flex items-center gap-4">
          <CardHeader className="flex-1 gap-1 space-y-0 p-0">
            <CardTitle className="text-lg font-semibold text-customPrimaryText">
              Thank you for sharing your details!
            </CardTitle>
            <CardDescription className="text-sm text-customSecondaryText">
              Info submitted! Let me know if you have any questions or need help.
            </CardDescription>
          </CardHeader>
        </div>
        {hasFormFilledValues && (
          <div className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/40 p-2">
            <div className="flex w-[60%] flex-1 flex-col gap-2">{formFilledLabelAndValues}</div>
            {/* <Button
            onClick={handleEdit}
            size="md"
            disabled={isformDisabled}
            className="flex items-center justify-center gap-2 border border-primary bg-transparent py-3 pl-4 pr-2 font-semibold text-primary"
          >
            Edit
            <PencilIcon className="h-4 w-4 text-primary" />
          </Button> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormFilledThankYouContent;
