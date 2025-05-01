import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import { Form, useForm } from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@breakout/design-system/components/Button/index';
import { getFormSchemaTypeDefinition } from '@meaku/core/utils/form_fields';
import { useState } from 'react';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import ChatFormField from './ChatFormField';
import { FormArtifactContent, FormArtifactMetadataType } from '@meaku/core/types/artifact';
import FormFilledThankYouContent from './FormFilledThankYouContent';
import { createFormSchema } from '../../utils/chat';

interface IFormProps {
  artifactId?: string;
  artifact?: FormArtifactContent;
  artifactMetadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isformDisabled?: boolean;
  usingForAgent?: boolean;
}

const FormArtifact = ({
  artifactId,
  artifact,
  artifactMetadata,
  handleSendUserMessage,
  isformDisabled,
  usingForAgent,
}: IFormProps) => {
  const [submitted, setSubmitted] = useState(artifactMetadata?.is_filled ?? false);
  const [isEditing, setIsEditing] = useState(false);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const isArtifactFormFilled = artifactMetadata?.is_filled ?? false;

  const formSchema = createFormSchema(artifact?.form_fields ?? []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchemaType = getFormSchemaTypeDefinition(formSchema);
  type FormSchemaType = typeof formSchemaType;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: artifactMetadata.filled_data ?? {},
    mode: 'onChange',
  });

  function onSubmit(values: FormSchemaType) {
    const response_data = {
      artifact_id: artifactId ?? '',
      form_data: values,
    };
    handleSendUserMessage({
      message: { content: '', event_type: AgentEventType.FORM_FILLED, event_data: response_data },
      message_type: 'EVENT', // TODO: Need to add the Event type When user edits the form and submit it
    });
    setSubmitted(true);
    setIsEditing(false); // Reset editing state after submit
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_FORM_SUBMITTED, { ...response_data });
  }

  // const handleEdit = () => {
  //   setIsEditing(true);
  //   setSubmitted(false);
  // };

  // Watch all form fields
  const formValues = form.watch();

  // check if all required fields are filled
  const areAllFieldsFilled = artifact?.form_fields
    .filter((field) => field.is_required)
    .every((field) => {
      const value = formValues[field.field_name];
      return value !== undefined && value !== '' && value !== null;
    });

  const isSubmitBtnDisabled =
    !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled || isformDisabled;

  const submitButtonRef = useElementScrollIntoView<HTMLButtonElement>({
    shouldScroll: isSubmitBtnDisabled && usingForAgent,
    delay: 0,
  });

  if (!artifact) {
    return <></>;
  }

  if (submitted && !isEditing) {
    return (
      <FormFilledThankYouContent
        artifact={artifact}
        formValues={formValues}
        // handleEdit={handleEdit}
        // isformDisabled={isformDisabled}
      />
    );
  }

  return (
    <Card className="w-full max-w-[404px] rounded-2xl border-none bg-transparent_gray_3">
      <CardContent className="flex flex-col gap-4 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" data-testid="contact-form">
            <div className="flex w-full flex-col items-start gap-6">
              {artifact.form_fields.map((field, i) => (
                <ChatFormField isArtifactFormFilled={isArtifactFormFilled} key={i} form={form} form_field={field} />
              ))}
            </div>
            <div className="flex justify-end">
              <Button ref={submitButtonRef} type="submit" disabled={isSubmitBtnDisabled} data-testid="submit-form-btn">
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
