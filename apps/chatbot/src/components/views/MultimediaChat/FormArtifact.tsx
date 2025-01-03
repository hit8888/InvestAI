import { FormArtifactMetadataType, FormArtifactContent, FormFieldType } from '@meaku/core/types/chat';
import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import CardHeader from '@breakout/design-system/components/layout/card-header';
import { Form, useForm } from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodSchema } from 'zod';
import Button from '@breakout/design-system/components/layout/button';
import { getZodType } from '../../../utils/form_fields.ts';
import ChatFormField from './ChatFormField.tsx';
import CardTitle from '@breakout/design-system/components/layout/card-title';
import { useState } from 'react';
import CardDescription from '@breakout/design-system/components/layout/card-description';
import { SalesEvent } from '@meaku/core/types/webSocket';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';

interface IFormProps {
  artifactId?: string;
  artifact?: FormArtifactContent;
  artifactMetadata: FormArtifactMetadataType;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
}

const createFormSchema = (form_fields: FormFieldType[]) => {
  const schemaShape: Record<string, ZodSchema> = {};

  form_fields.forEach((field) => {
    const fieldSchema = getZodType(field.data_type);

    // Make the field required if is_required is not null or undefined
    if (field.is_required) {
      schemaShape[field.field_name] = fieldSchema;
    } else {
      schemaShape[field.field_name] = fieldSchema.optional();
    }
  });

  return z.object(schemaShape);
};

const FormArtifact = ({ artifactId, artifact, artifactMetadata, handleSendUserMessage }: IFormProps) => {
  const [submitted, setSubmitted] = useState(artifactMetadata?.is_filled ?? false);
  const { trackChatbotEvent } = useChatbotAnalytics();

  const formSchema = createFormSchema(artifact?.form_fields ?? []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: artifactMetadata.filled_data ?? {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const response_data = {
      artifact_id: artifactId,
      form_data: values,
    };
    handleSendUserMessage({ message: '', eventType: SalesEvent.FORM_FILLED, eventData: response_data });
    setSubmitted(true);
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.DEMO_FORM_SUBMITTED, { ...response_data });
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {artifact.form_fields.map((field, i) => (
              <ChatFormField key={i} form={form} form_field={field} />
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormArtifact;
