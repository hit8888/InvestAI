import { AgentEventType, SendUserMessageParams } from '@meaku/core/types/webSocketData';
import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import { Form, useForm } from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@breakout/design-system/components/Button/index';
import { getFormSchemaTypeDefinition } from '@meaku/core/utils/form_fields';
import { useState } from 'react';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ChatFormField from './ChatFormField';
import { FormArtifactContent, FormArtifactMetadataType } from '@meaku/core/types/artifact';
import FormFilledThankYouContent from './FormFilledThankYouContent';
import { createFormSchema } from '../../utils/chat';
import { sanitizeObject } from '@meaku/core/utils/sanitize';
import { ViewType } from '@meaku/core/types/common';
import { cn } from '@breakout/design-system/lib/cn';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

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
}

const FormArtifact = ({
  artifactId,
  artifact,
  artifactMetadata,
  handleSendUserMessage,
  viewType,
  artifactResponseId,
}: IFormProps) => {
  const { formMetadata: artifactFormMetadata } = artifactMetadata as { formMetadata: FormArtifactMetadataType };
  const isArtifactFormFilled = artifactFormMetadata?.is_filled ?? false;
  const [submitted, setSubmitted] = useState(isArtifactFormFilled);
  const [isEditing, setIsEditing] = useState(false);
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const isMobile = useIsMobile();

  const formFields = artifact?.form_fields ?? [];

  const requiredFormFields = formFields.filter((field) => field.is_required) ?? [];

  const formSchema = createFormSchema(formFields);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchemaType = getFormSchemaTypeDefinition(formSchema);
  type FormSchemaType = typeof formSchemaType;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: artifactFormMetadata?.filled_data ?? {},
    mode: 'onTouched',
  });

  const formDisabled = viewType !== ViewType.USER;

  // Convert string values of integer fields to actual numbers before forming the payload
  const getFormFilledEventData = (values: FormSchemaType) => {
    const sanitizedValues: Record<string, unknown> = { ...values };

    formFields.forEach((field) => {
      if (field.data_type === 'int') {
        const val = sanitizedValues[field.field_name];
        if (typeof val === 'string') {
          const parsed = parseInt(val, 10);
          if (!isNaN(parsed)) {
            sanitizedValues[field.field_name] = parsed;
          }
        }
      }
    });

    return {
      artifact_id: artifactId ?? '',
      form_data: sanitizedValues,
    };
  };

  const sendFormFilledMessage = (eventData: FormFilledEventDataType) => {
    handleSendUserMessage({
      message: { content: '', event_type: AgentEventType.FORM_FILLED, event_data: eventData },
      message_type: 'EVENT', // TODO: Need to add the Event type When user edits the form and submit it
      response_id: artifactResponseId,
    });
  };

  function onSubmit(values: FormSchemaType) {
    if (formDisabled) {
      return;
    }

    const eventData = getFormFilledEventData(values);

    sendFormFilledMessage(eventData);
    setSubmitted(true);
    setIsEditing(false); // Reset editing state after submit
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_FORM_SUBMITTED, { ...eventData });
  }

  // const handleEdit = () => {
  //   setIsEditing(true);
  //   setSubmitted(false);
  // };

  // Watch all form fields
  const formValues = sanitizeObject(form.watch());

  // check if all required fields are filled
  const areAllFieldsFilled = requiredFormFields.every((field) => {
    const value = formValues[field.field_name];
    return value !== undefined && value !== '' && value !== null;
  });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  if (!artifact) {
    return <></>;
  }

  if (submitted && !isEditing) {
    return (
      <FormFilledThankYouContent
        formFields={formFields}
        formValues={artifactFormMetadata}
        // handleEdit={handleEdit}
      />
    );
  }

  return (
    <Card
      className={cn(['w-full max-w-[404px] rounded-2xl border-none bg-transparent_gray_3', isMobile && 'max-w-lg'])}
    >
      <CardContent className="flex flex-col gap-4 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" data-testid="contact-form">
            <div className="flex w-full flex-col items-start gap-6">
              {formFields.map((field, i) => (
                <ChatFormField
                  key={i}
                  isArtifactFormFilled={isArtifactFormFilled}
                  form={form}
                  form_field={field}
                  artifactMetadata={artifactFormMetadata}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={formDisabled || isSubmitBtnDisabled} data-testid="submit-form-btn">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormArtifact;
