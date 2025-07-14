import { FormArtifactMetadataType, QualificationFlowArtifactProps } from '@meaku/core/types/artifact';
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
import { cn } from '../../../lib/cn';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { useMemo, useState } from 'react';
import FormFilledThankYouContent from '../../layout/FormFilledThankYouContent';
import Typography from '../../Typography';

type QualificationFormProps = QualificationFlowArtifactProps & {
  handleIncrementSteps: () => void;
  steps: number;
};

const QualificationForm = ({
  artifact,
  handleSendUserMessage,
  handleIncrementSteps,
  steps,
}: QualificationFormProps) => {
  const isMobile = useIsMobile();
  const { metadata: artifactMetadataValue, artifact_id: artifactId } = artifact;
  const { formMetadata: artifactFormMetadata } = artifactMetadataValue as { formMetadata: FormArtifactMetadataType };
  const formFields = artifact.content?.form_fields;
  const [submitted, setSubmitted] = useState(artifactFormMetadata.is_filled);
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const cardClassName = useMemo(() => {
    if (isMobile) {
      return 'max-w-full gap-4 rounded-2xl bg-transparent_gray_3 p-4';
    }
    return 'max-w-[40%]';
  }, [isMobile]);

  const formSchema = createFormSchema(formFields ?? []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchemaType = getFormSchemaTypeDefinition(formSchema);
  type FormSchemaType = typeof formSchemaType;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: artifactFormMetadata.filled_data ?? {},
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
      response_id: artifact.response_id,
    });
    setSubmitted(true);
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

  if (isMobile && submitted) {
    return <FormFilledThankYouContent steps={steps} formFields={formFields} formValues={artifactFormMetadata} />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className={cn(['flex w-full flex-col items-center justify-center gap-8', cardClassName])}>
        {isMobile ? (
          <div className="flex w-full flex-col items-start gap-2">
            <Typography variant="label-16-semibold" textColor="gray500">
              {`${steps} of 2`}
            </Typography>
            <Typography variant="label-16-medium" textColor="textPrimary">
              How can we reach you?
            </Typography>
          </div>
        ) : (
          <p className="w-full text-left text-4xl font-semibold text-customPrimaryText">How can we reach you?</p>
        )}
        <Card className="w-full rounded-2xl border-none bg-transparent shadow-none">
          <CardContent className="flex flex-col gap-4 p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className={cn(['flex flex-col gap-8', isMobile && 'gap-4'])}>
                <div className="flex w-full flex-col items-start gap-6">
                  {formFields.map((field, i) => (
                    <ChatFormField
                      fieldClassName={cn([
                        'h-20 pl-6 text-3xl placeholder:text-2xl',
                        isMobile && 'h-10 pl-4 text-sm placeholder:text-sm',
                      ])}
                      isArtifactFormFilled={false}
                      key={i}
                      form={form}
                      form_field={field}
                      artifactMetadata={artifactFormMetadata}
                    />
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button
                    className={cn([!isMobile && 'h-12 w-28 rounded-xl p-0 text-xl'])}
                    type="submit"
                    buttonStyle={isMobile ? 'rightIcon' : 'default'}
                    disabled={isSubmitBtnDisabled}
                    rightIcon={<ArrowRight className="text-white" width={'24'} height={'24'} />}
                    variant="system"
                  >
                    Next
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
