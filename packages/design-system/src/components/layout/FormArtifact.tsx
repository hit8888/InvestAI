import {
  FormArtifactMetadataType,
  FormFieldType,
  AgentEventType,
  WebSocketMessage,
} from '@meaku/core/types/webSocketData';
import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import { Form, useForm } from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@breakout/design-system/components/layout/button';
import {
  getZodType,
  schemaShape,
  getFormSchemaTypeDefinition,
  getschemaShapeValidatedByZode,
} from '@meaku/core/utils/form_fields';
import { useState } from 'react';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ChatFormField from './ChatFormField';
import DemoFormSubmitBtnTickIcon from '../icons/demoform-submit-tick-icon';
import { FormArtifactContent } from '@meaku/core/types/artifact';
import FormFilledThankYouContent from './FormFilledThankYouContent';

interface IFormProps {
  artifactId?: string;
  artifact?: FormArtifactContent;
  artifactMetadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  isformDisabled?: boolean;
}

const createFormSchema = (form_fields: FormFieldType[]) => {
  form_fields.forEach((field) => {
    const fieldSchema = getZodType(field.data_type);

    // Make the field required if is_required is not null or undefined
    if (field.is_required) {
      schemaShape[field.field_name] = fieldSchema;
    } else {
      schemaShape[field.field_name] = fieldSchema.optional();
    }
  });

  return getschemaShapeValidatedByZode(schemaShape);
};

const FormArtifact = ({
  artifactId,
  artifact,
  artifactMetadata,
  handleSendUserMessage,
  isformDisabled,
}: IFormProps) => {
  const [submitted, setSubmitted] = useState(artifactMetadata?.is_filled ?? false);
  const [isEditing, setIsEditing] = useState(false);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

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
      message_type: 'EVENT',
    });
    setSubmitted(true);
    setIsEditing(false); // Reset editing state after submit
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_FORM_SUBMITTED, { ...response_data });
  }

  const handleEdit = () => {
    setIsEditing(true);
    setSubmitted(false);
  };

  // Watch all form fields
  const formValues = form.watch();

  // check if all fields are filled
  const areAllFieldsFilled = artifact?.form_fields.every((field) => {
    const value = formValues[field.field_name];
    return value !== undefined && value !== '' && value !== null;
  });

  if (!artifact) {
    return <></>;
  }

  const isSubmitBtnDisabled =
    !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled || isformDisabled;

  if (submitted && !isEditing) {
    return (
      <FormFilledThankYouContent
        artifact={artifact}
        formValues={formValues}
        handleEdit={handleEdit}
        isformDisabled={isformDisabled}
      />
    );
  }

  return (
    <Card className="max-w-96 rounded-2xl border-none bg-primary/10">
      <CardContent className="flex flex-col gap-4 p-4">
        <p className="text-lg font-semibold text-primary">Share Your Details</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-[rgb(var(--primary-foreground)/0.18)] p-4"
            data-testid="contact-form"
          >
            <div className="flex w-full flex-col items-start gap-6">
              {artifact.form_fields.map((field, i) => (
                <ChatFormField key={i} form={form} form_field={field} />
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitBtnDisabled}
                className="flex items-center gap-2 border-2 border-[rgb(var(--primary-foreground)/0.24)] bg-primary/70 px-3 hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-20"
                data-testid="submit-form-btn"
              >
                Submit
                <DemoFormSubmitBtnTickIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormArtifact;
