import { useState } from 'react';
import { Button, Form, useForm } from '@meaku/saral';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import ChatFormField from '../../../components/ChatFormField';
import { FormArtifactContent, FormArtifactMetadataType } from '../../../utils/artifact';
import FormFilledThankYouContent from '../../../components/FormFilledThankYouContent';
import { createFormSchema } from '../utils';
import { sanitizeObject } from '../sanitize';
import { ViewType } from '../../../utils/enum';
import { MessageEventType, SendUserMessageParams } from '../../../types/message';

type FormFilledEventDataType = {
  artifact_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form_data: Record<string, any>;
};

interface IFormProps {
  artifactId?: string;
  artifact?: FormArtifactContent;
  artifactMetadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  viewType: ViewType;
  artifactResponseId?: string;
  calendarMessageExist?: boolean;
}

const FormArtifact = ({
  artifactId,
  artifact,
  artifactMetadata,
  handleSendUserMessage,
  viewType,
  artifactResponseId,
  calendarMessageExist,
}: IFormProps) => {
  const { formMetadata: artifactFormMetadata } = artifactMetadata as { formMetadata: FormArtifactMetadataType };
  const isArtifactFormFilled = artifactFormMetadata?.is_filled ?? false;
  const [submitted, setSubmitted] = useState(isArtifactFormFilled);
  const { trackEvent } = useCommandBarAnalytics();

  const formFields = artifact?.form_fields ?? [];

  const requiredFormFields = formFields.filter((field) => field.is_required) ?? [];

  const formSchema = createFormSchema(requiredFormFields);

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: artifactFormMetadata?.filled_data ?? {},
    mode: 'onTouched',
  });

  const formDisabled = viewType !== ViewType.USER;

  const getFormFilledEventData = (values: Record<string, unknown>) => {
    return {
      artifact_id: artifactId ?? '',
      form_data: values,
    };
  };

  const sendFormFilledMessage = (eventData: FormFilledEventDataType) => {
    handleSendUserMessage({
      message: '',
      overrides: {
        event_type: MessageEventType.FORM_FILLED,
        event_data: eventData,
        response_id: artifactResponseId,
      },
    });
  };

  function onSubmit(values: Record<string, unknown>) {
    if (formDisabled) {
      return;
    }
    const eventData = getFormFilledEventData(values);

    sendFormFilledMessage(eventData);
    setSubmitted(true);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.FORM_SUBMITTED, { ...eventData });
  }

  // Watch all form fields
  const formValues = sanitizeObject(form.watch());

  // check if all required fields are filled
  const areAllFieldsFilled = requiredFormFields.every((field) => {
    const value = formValues[field.field_name];
    return value !== undefined && value !== '' && value !== null;
  });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  if (!artifact || calendarMessageExist) {
    return <></>;
  }

  if (submitted) {
    return (
      <FormFilledThankYouContent
        className="flex min-h-[300px] flex-col"
        formFields={formFields}
        formValues={artifactFormMetadata.filled_data ?? {}}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" data-testid="contact-form">
        <div className="flex w-full flex-col items-start gap-5">
          {formFields.map((field, i) => (
            <ChatFormField
              fieldClassName="pl-2 border-none bg-gray-100 focus-visible:ring-offset-0"
              key={i}
              isArtifactFormFilled={isArtifactFormFilled}
              form={form}
              form_field={field}
              artifactMetadata={artifactFormMetadata}
            />
          ))}
        </div>
        <Button type="submit" disabled={formDisabled || isSubmitBtnDisabled} data-testid="submit-form-btn">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default FormArtifact;
