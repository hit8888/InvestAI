import { useState } from 'react';
import { Button, Form, useForm, Typography } from '@meaku/saral';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

import { FormArtifactContent, FormArtifactMetadataType } from '../../../utils/artifact';
import { SendUserMessageParams, MessageEventType } from '../../../types/message';
import ChatFormField from '../../../components/ChatFormField';
import FormFilledThankYouContent from '../../../components/FormFilledThankYouContent';
import { handleEmailDomainCheck } from '../../../helpers/checkEmailDomain';

interface FormArtifactProps {
  artifactId: string;
  content: FormArtifactContent;
  metadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isFilled: boolean;
  filledData: Record<string, string> | undefined;
  responseId?: string;
}

export const FormArtifact = ({
  artifactId,
  content,
  metadata,
  handleSendUserMessage,
  isFilled,
  responseId,
  filledData,
}: FormArtifactProps) => {
  const [submitted, setSubmitted] = useState(metadata.is_filled ?? false);
  const [, setIsAnimating] = useState(false);
  const { trackEvent } = useCommandBarAnalytics();
  const [emailError, setEmailError] = useState('');
  const formFields = content.form_fields ?? [];
  const requiredFormFields = formFields.filter((field) => field.is_required);

  // Use a simpler approach to avoid TypeScript issues
  const form = useForm<Record<string, string>>({
    defaultValues: content.default_data ?? ((metadata.filled_data ?? {}) as Record<string, string>),
    mode: 'onTouched',
  });

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const res = await handleEmailDomainCheck(values.user_email as string);
      if (res?.valid) {
        const eventData = {
          artifact_id: artifactId,
          form_data: values,
          qualification: content.qualification,
        };

        handleSendUserMessage({
          message: '',
          overrides: {
            response_id: responseId,
            role: 'user',
            event_type: MessageEventType.FORM_FILLED,
            event_data: eventData,
            timestamp: new Date().toISOString(),
          },
        });

        // Start animation
        setIsAnimating(true);

        // Delay the state change to allow for fade out animation
        setTimeout(() => {
          setSubmitted(true);
          setIsAnimating(false);
        }, 300); // Match the CSS transition duration

        if (content.qualification) {
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
  };

  // Watch all form fields
  const formValues = form.watch();

  // Check if all required fields are filled
  const areAllFieldsFilled = requiredFormFields.every((field) => {
    const value = formValues[field.field_name];
    return value !== undefined && value !== '' && value !== null;
  });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  if (submitted || isFilled) {
    return <FormFilledThankYouContent formFields={formFields} formValues={filledData} />;
  }

  return (
    <div className="mt-3 w-full border-none max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        {content.default_message && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">{content.default_message}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 rounded-lg">
            <div className="flex w-full flex-col items-start gap-5">
              {formFields.map((field, i) => (
                <ChatFormField
                  fieldClassName="pl-2 border-none bg-gray-100 focus-visible:ring-offset-0"
                  key={i}
                  isArtifactFormFilled={isFilled}
                  form={form}
                  form_field={field}
                  artifactMetadata={metadata}
                />
              ))}
            </div>
            {emailError && (
              <Typography variant="body-small" className="text-red-600">
                {emailError}
              </Typography>
            )}
            <Button type="submit" disabled={isSubmitBtnDisabled} size="sm">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
