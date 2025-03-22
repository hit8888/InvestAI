import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import CardHeader from '@breakout/design-system/components/layout/card-header';
import CardTitle from './card-title';
import CardDescription from './card-description';
import DemoFormThankYouTickIcon from '../icons/demoform-thankyou-tick-icon';
// import { PencilIcon } from 'lucide-react';
// import Button from './button';
import { FormArtifactContent } from '@meaku/core/types/artifact';

type FormFilledThankYouContentProps = {
  artifact: FormArtifactContent;
  formValues: Record<string, string>;
  // handleEdit: () => void;
  // isformDisabled?: boolean;
};

const FormFilledThankYouContent = ({
  artifact,
  formValues,
  // handleEdit,
  // isformDisabled,
}: FormFilledThankYouContentProps) => {
  return (
    <Card className="max-w-96 rounded-2xl border-none bg-primary/10">
      <CardContent className="flex flex-col gap-6 p-4">
        <div className="flex items-center gap-4">
          <DemoFormThankYouTickIcon className="h-14 w-14 text-primary/60" />
          <CardHeader className="max-w-72 flex-1 gap-1 space-y-0 p-0">
            <CardTitle className="text-lg font-semibold text-primary">Thank You for Sharing Your Details!</CardTitle>
            <CardDescription className="text-primary/50">
              Info submitted! Let me know if you have any questions or need help.
            </CardDescription>
          </CardHeader>
        </div>
        <div className="flex w-full items-center gap-2 rounded-lg border border-dashed border-primary/40 p-2">
          <div className="flex w-[60%] flex-1 flex-col gap-2">
            {artifact.form_fields.map((field) => (
              <div key={field.field_name} className="flex w-full items-center gap-2">
                <p className="text-sm font-medium text-primary">{field.label}:</p>
                <p
                  title={formValues[field.field_name]}
                  className="max-w-full truncate text-sm text-customSecondaryText"
                >
                  {formValues[field.field_name]}
                </p>
              </div>
            ))}
          </div>
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
      </CardContent>
    </Card>
  );
};

export default FormFilledThankYouContent;
