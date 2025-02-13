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
import DemoFormSubmitBtnTickIcon from '../icons/demoform-submit-tick-icon';
import DemoFormThankYouTickIcon from '../icons/demoform-thankyou-tick-icon';

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
      <Card className="max-w-96 rounded-2xl border-none bg-primary/10">
        <CardContent className='p-4'>
          <div className='flex items-center gap-4'>
            <DemoFormThankYouTickIcon className='text-primary/60 h-14 w-14' />
            <CardHeader className='p-0 space-y-0 gap-1 max-w-72 flex-1'>
              <CardTitle className='text-lg font-semibold text-primary'>Thank You for Sharing Your Details!</CardTitle>
              <CardDescription className='text-primary/50'>Info submitted! Let me know if you have any questions or need help.</CardDescription>
            </CardHeader>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl max-w-96 border-none bg-primary/10">
      <CardContent className="p-4 flex flex-col gap-4">
        <p className='text-lg font-semibold text-primary'>Share Your Details</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-[rgb(var(--primary-foreground)/0.18)]" data-testid="contact-form">
            <div className='flex flex-col items-center gap-6'>
            {artifact.form_fields.map((field, i) => (
              <ChatFormField key={i} form={form} form_field={field} />
            ))}
            </div>
            <div className='flex justify-end'>
              <Button type="submit" className='flex px-3 items-center gap-2 border-2 border-[rgb(var(--primary-foreground)/0.24)] bg-primary/70 hover:bg-primary/80' data-testid="submit-form-btn">
                Submit
                <DemoFormSubmitBtnTickIcon className='h-4 w-4'/>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormArtifact;
