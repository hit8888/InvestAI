import { useEffect, useState } from 'react';
import { Button, Form, Typography, useForm } from '@meaku/saral';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { FormArtifactContent, FormArtifactMetadataType } from '../utils/artifact';
import FormFilledThankYouContent from './FormFilledThankYouContent';
import { sanitizeObject } from '../features/book-meeting/sanitize';
import { MessageEventType, SendUserMessageParams } from '../types/message';
import { handleEmailDomainCheck } from '../helpers/checkEmailDomain';
import ChatFormField from './ChatFormField';
import { createFormSchema } from '../features/book-meeting/utils';

type FormFilledEventDataType = {
  artifact_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form_data: Record<string, any>;
  qualification: boolean | undefined;
};

interface IFormProps {
  artifactId?: string;
  artifact: FormArtifactContent;
  artifactMetadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  artifactResponseId?: string;
  calendarMessageExist?: boolean;
  isFilled?: boolean;
  filledData?: Record<string, string> | undefined;
}

const FormArtifact = ({
  artifactId,
  artifact,
  artifactMetadata,
  handleSendUserMessage,
  artifactResponseId,
  calendarMessageExist,
  isFilled,
  filledData,
}: IFormProps) => {
  const { formMetadata: artifactFormMetadata } = artifactMetadata as { formMetadata: FormArtifactMetadataType };
  const isArtifactFormFilled = artifactFormMetadata?.is_filled ?? false;
  const [submitted, setSubmitted] = useState(isArtifactFormFilled);
  const { trackEvent } = useCommandBarAnalytics();
  const [emailError, setEmailError] = useState('');
  const [showShimmer, setShowShimmer] = useState(!isArtifactFormFilled || !submitted);

  const formFields = artifact?.form_fields || [];
  const requiredFormFields = formFields.filter((field) => field.is_required);
  const formSchema = createFormSchema(formFields);

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any) as any,
    defaultValues: artifact?.default_data ?? filledData ?? {},
    mode: 'onTouched',
  });

  // Watch all form fields
  const formValues = sanitizeObject(form.watch());

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (showShimmer) {
        setShowShimmer(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  if (showShimmer && !isFilled && !submitted) {
    return <FormArtifactShimmer />;
  }

  // Convert string values of integer fields to actual numbers before forming the payload
  const getFormFilledEventData = (values: Record<string, unknown>) => {
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
      qualification: artifact.qualification,
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

  async function onSubmit(values: Record<string, unknown>) {
    const eventData = getFormFilledEventData(values);

    try {
      const res = await handleEmailDomainCheck(values.user_email as string);
      if (res?.valid) {
        sendFormFilledMessage(eventData);
        setSubmitted(true);
        if (artifact.qualification) {
          trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.QUALIFICATION_FORM_SUBMITTED, { ...eventData });
        } else {
          trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.FORM_SUBMITTED, { ...eventData });
        }
      } else {
        setEmailError(res?.reason ?? 'Invalid email domain');
        setTimeout(() => {
          setEmailError('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking email domain:', error);
    }
  }

  // check if all required fields are filled
  const areAllFieldsFilled = requiredFormFields.every((field) => {
    const value = formValues[field.field_name];
    return value !== undefined && value !== '' && value !== null;
  });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  if (!artifact || calendarMessageExist) {
    return <></>;
  }

  if (submitted || isFilled) {
    return <FormFilledThankYouContent formFields={formFields} formValues={filledData ?? {}} />;
  }

  return (
    <div className="flex w-full max-w-md mx-auto flex-col gap-4">
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
                onBlur={() => {
                  trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.FORM_FIELD_INTERACTED, {
                    field_name: field.field_name,
                  });
                }}
              />
            ))}
            {emailError && (
              <Typography variant="body-small" className="text-red-600">
                {emailError}
              </Typography>
            )}
          </div>
          <Button type="submit" disabled={isSubmitBtnDisabled} data-testid="submit-form-btn">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

const FormArtifactShimmer = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="w-full h-10 bg-gray-200 rounded-md animate-pulse" />
      ))}
    </div>
  );
};

export default FormArtifact;
