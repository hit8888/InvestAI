import { useState } from 'react';
import { Button, Form, useForm, Typography } from '@meaku/saral';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

import { FormArtifactContent, FormArtifactMetadataType, QualificationQuestionType } from '../../../utils/artifact';
import { SendUserMessageParams, MessageEventType } from '../../../types/message';
import { QualificationQuestions } from './QualificationQuestions';
import ChatFormField from '../../../components/ChatFormField';
import FormFilledThankYouContent from '../../../components/FormFilledThankYouContent';

interface FormArtifactProps {
  artifactId: string;
  content: FormArtifactContent;
  metadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isFilled: boolean;
  filledData: Record<string, string>;
  responseId?: string;
  qualificationQuestionsAnswered?: boolean;
  qualificationFilledData?: Array<{ id: string; answer: string }>;
}

export const FormArtifact = ({
  artifactId,
  content,
  metadata,
  handleSendUserMessage,
  isFilled,
  responseId,
  qualificationQuestionsAnswered,
  qualificationFilledData,
  filledData,
}: FormArtifactProps) => {
  const [submitted, setSubmitted] = useState(metadata.is_filled ?? false);
  const [, setIsAnimating] = useState(false);
  const { trackEvent } = useCommandBarAnalytics();
  const formFields = content.form_fields ?? [];
  const requiredFormFields = formFields.filter((field) => field.is_required);

  // Use a simpler approach to avoid TypeScript issues
  const form = useForm<Record<string, string>>({
    defaultValues: (metadata.filled_data ?? {}) as Record<string, string>,
    mode: 'onTouched',
  });

  const handleSubmit = (values: Record<string, string>) => {
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
  };

  // Watch all form fields
  const formValues = form.watch();

  // Check if all required fields are filled
  const areAllFieldsFilled = requiredFormFields.every((field) => {
    const value = formValues[field.field_name];
    return value !== undefined && value !== '' && value !== null;
  });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  const qualificationQuestions = (content?.qualification_questions ?? []) as QualificationQuestionType[];

  const handleQualificationQuestionsSubmit = (answers: Record<string, string>) => {
    // Transform answers into the required format
    const qualificationResponses = qualificationQuestions.map((question) => ({
      question: question.question,
      answer: answers[question.id ?? ''] || '',
      answer_type: 'DROP_DOWN',
      id: question.id ?? '',
    }));

    const eventData = {
      artifact_id: artifactId,
      qualification_responses: qualificationResponses,
    };

    handleSendUserMessage({
      message: '',
      overrides: {
        response_id: responseId,
        role: 'user',
        event_type: MessageEventType.QUALIFICATION_FORM_FILLED,
        event_data: eventData,
        timestamp: new Date().toISOString(),
      },
    });
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.QUALIFICATION_QUESTIONS_SUBMITTED, { ...eventData });
  };

  const showStep2 = submitted || isFilled;

  if (showStep2 && !content.qualification) {
    return <FormFilledThankYouContent formFields={formFields} formValues={filledData} />;
  }

  return (
    <div className="mt-3 w-full border-none">
      <div className="flex flex-col gap-4">
        {content.default_message && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">{content.default_message}</p>
          </div>
        )}

        {qualificationQuestions.length > 0 && (
          <Typography className="mb-2 font-medium text-primary" variant="body-small">
            {showStep2 ? 'Step 2 of 2' : 'Step 1 of 2'}
          </Typography>
        )}

        {/* Step 1: Form */}
        {!showStep2 && (
          <div
            className={`transition-all duration-300 ease-in-out ${
              showStep2 ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[1000px] opacity-100'
            }`}
          >
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
                <Button type="submit" disabled={isSubmitBtnDisabled} size="sm">
                  {content.qualification ? 'Next' : 'Submit'}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Step 2: Thank You Content and Qualification Questions */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showStep2 ? 'max-h-[1000px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="flex w-full flex-col gap-5 rounded-xl">
            {!!content.qualification && (
              <QualificationQuestions
                qualificationQuestions={qualificationQuestions}
                isFilled={qualificationQuestionsAnswered}
                filledData={qualificationFilledData}
                onSubmit={handleQualificationQuestionsSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
