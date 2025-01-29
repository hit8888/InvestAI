import { FormArtifactMetadataType, FormArtifactContent, FormFieldType } from '@meaku/core/types/agent';
import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import CardHeader from '@breakout/design-system/components/layout/card-header';
import { Form, useForm } from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@breakout/design-system/components/layout/button';
import {
  getZodType,
  schemaShape,
  getFormSchemaTypeDefinition,
  getschemaShapeValidatedByZode,
} from '@meaku/core/utils/form_fields';
import CardTitle from '@breakout/design-system/components/layout/card-title';
import { useState } from 'react';
import CardDescription from '@breakout/design-system/components/layout/card-description';
import { IWebSocketHandleMessage, SalesEvent } from '@meaku/core/types/webSocket';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ChatFormField from './ChatFormField';

interface IFormProps {
  artifactId?: string;
  artifact?: FormArtifactContent;
  artifactMetadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
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

const FormArtifact = ({ artifactId, artifact, artifactMetadata, handleSendUserMessage }: IFormProps) => {
  const [submitted, setSubmitted] = useState(artifactMetadata?.is_filled ?? false);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const formSchema = createFormSchema(artifact?.form_fields ?? []);
  const formSchemaType = getFormSchemaTypeDefinition(formSchema);

  const form = useForm<typeof formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: artifactMetadata.filled_data ?? {},
  });

  function onSubmit(values: typeof formSchemaType) {
    const response_data = {
      artifact_id: artifactId,
      form_data: values,
    };
    handleSendUserMessage({ message: '', eventType: SalesEvent.FORM_FILLED, eventData: response_data });
    setSubmitted(true);
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.DEMO_FORM_SUBMITTED, { ...response_data });
  }

  if (!artifact) {
    return <></>;
  }

  if (submitted) {
    return (
      <Card className="m-4 ml-0 max-w-[350px]">
        <CardHeader>
          <CardTitle>Thank You for Sharing Your Details!</CardTitle>
          <CardDescription>Info submitted! We will reach out soon.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="m-4 ml-0 max-w-[350px]">
      <CardContent className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="contact-form">
            {artifact.form_fields.map((field, i) => (
              <ChatFormField key={i} form={form} form_field={field} />
            ))}
            <Button type="submit" data-testid="submit-form-btn">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormArtifact;
