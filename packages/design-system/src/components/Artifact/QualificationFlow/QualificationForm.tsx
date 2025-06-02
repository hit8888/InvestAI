import { QualificationFlowArtifactProps } from './QualificationTypes';
import Card from '@breakout/design-system/components/layout/card';
import CardContent from '@breakout/design-system/components/layout/card-content';
import ChatFormField from '../../layout/ChatFormField';
import Button from '@breakout/design-system/components/Button/index';
import { Form, useForm } from '@breakout/design-system/components/layout/form';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { createFormSchema } from '../../../utils/chat';
import { getFormSchemaTypeDefinition } from '@meaku/core/utils/form_fields';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgentEventType } from '@meaku/core/types/webSocketData';
import ArrowRight from '../../icons/ArrowRight';

type QualificationFormProps = QualificationFlowArtifactProps & {
  handleIncrementSteps: () => void;
};

const QualificationForm = ({ artifact, handleSendUserMessage, handleIncrementSteps }: QualificationFormProps) => {
  const { metadata: artifactMetadata, artifact_id: artifactId } = artifact;
  const formFields = artifact.content?.form_fields;
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const formSchema = createFormSchema(formFields ?? []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchemaType = getFormSchemaTypeDefinition(formSchema);
  type FormSchemaType = typeof formSchemaType;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: artifactMetadata.filled_data ?? {},
    mode: 'onTouched',
  });

  function onSubmit(values: FormSchemaType) {
    const response_data = {
      artifact_id: artifactId ?? '',
      form_data: values,
      qualification: artifact.content.qualification,
    };
    handleSendUserMessage({
      message: { content: '', event_type: AgentEventType.FORM_FILLED, event_data: response_data },
      message_type: 'EVENT', // TODO: Need to add the Event type When user edits the form and submit it
    });
    handleIncrementSteps();
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.QUALIFICATION_FORM_SUBMITTED, { ...response_data });
  }

  // Watch all form fields
  const formValues = form.watch();

  // check if all required fields are filled
  const areAllFieldsFilled = formFields
    .filter((field) => field.is_required)
    .every((field) => {
      const value = formValues[field.field_name];
      return value !== undefined && value !== '' && value !== null;
    });

  const isSubmitBtnDisabled = !form.formState.isValid || form.formState.isSubmitting || !areAllFieldsFilled;

  if (!artifact) {
    return <></>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-[40%] flex-col items-center justify-center gap-8">
        <p className="w-full text-left text-5xl font-semibold text-customPrimaryText">How can we reach you?</p>
        <Card className="w-full rounded-2xl border-none bg-inherit shadow-none">
          <CardContent className="flex flex-col gap-4 p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <div className="flex w-full flex-col items-start gap-6">
                  {formFields.map((field, i) => (
                    <ChatFormField
                      fieldClassName="h-20 pl-6 text-3xl placeholder:text-3xl"
                      isArtifactFormFilled={false}
                      key={i}
                      form={form}
                      form_field={field}
                      artifactMetadata={artifactMetadata}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button className="h-12 w-28 rounded-xl p-0 text-xl" type="submit" disabled={isSubmitBtnDisabled}>
                    Next
                    <ArrowRight className="text-white" width={'24'} height={'24'} />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualificationForm;
