import { useState } from 'react';
import { FormArtifactMetadataType, QualificationFlowArtifactProps } from '../../../../utils/artifact';
import { Button, Form, useForm, Typography } from '@meaku/saral';
import ChatFormField from '../../../../components/ChatFormField';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { createFormSchema } from '../../utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageEventType } from '../../../../types/message';
import FormFilledThankYouContent from '../../../../components/FormFilledThankYouContent';

type QualificationFormProps = QualificationFlowArtifactProps & {
  handleIncrementSteps: () => void;
  steps: number;
};

const QualificationForm = ({
  artifact,
  handleSendUserMessage,
  handleIncrementSteps,
  steps,
}: QualificationFormProps) => {
  const { metadata: artifactMetadataValue, artifact_id: artifactId } = artifact;
  const { formMetadata: artifactFormMetadata } = artifactMetadataValue as { formMetadata: FormArtifactMetadataType };
  const formFields = artifact.content?.form_fields;
  const [submitted, setSubmitted] = useState(artifactFormMetadata.is_filled);
  const { trackEvent } = useCommandBarAnalytics();

  const formSchema = createFormSchema(formFields ?? []);

  const form = useForm({
    // @ts-expect-error - Type instantiation is excessively deep
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: artifactFormMetadata.filled_data ?? {},
    mode: 'onTouched',
  });

  function onSubmit(values: Record<string, unknown>) {
    const response_data = {
      artifact_id: artifactId ?? '',
      form_data: values,
      qualification: artifact.content.qualification,
    };
    handleSendUserMessage({
      message: '',
      overrides: {
        event_type: MessageEventType.FORM_FILLED,
        event_data: response_data,
        response_id: artifact.response_id,
      },
    });
    setSubmitted(true);
    handleIncrementSteps();
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.QUALIFICATION_FORM_SUBMITTED, { ...response_data });
  }

  // Watch all form fields
  const formValues = form.watch();

  // check if all required fields are filled
  const areAllFieldsFilled = formFields
    .filter((field) => field.is_required)
    .every((field) => {
      const value = formValues[field.field_name];
      return value !== undefined && value !== '' && value !== null;
    });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  if (!artifact) {
    return <></>;
  }

  if (submitted) {
    return (
      <FormFilledThankYouContent
        formFields={formFields}
        formValues={artifactFormMetadata.filled_data ?? {}}
        showSteps={steps === 1}
      />
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-4">
      <Typography className="mb-2 font-medium text-primary" variant="body-small">
        Step 1 of 2
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-lg">
          <div className="flex w-full flex-col items-start gap-5">
            {formFields.map((field, i) => (
              <ChatFormField
                fieldClassName="pl-2 border-none bg-gray-100 focus-visible:ring-offset-0"
                key={i}
                isArtifactFormFilled={false}
                form={form}
                form_field={field}
                artifactMetadata={artifactFormMetadata}
              />
            ))}
          </div>
          <Button type="submit" disabled={isSubmitBtnDisabled} size="sm">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QualificationForm;
