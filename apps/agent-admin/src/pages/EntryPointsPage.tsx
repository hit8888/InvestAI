import PageContainer from '../components/AgentManagement/PageContainer';
import Card from '../components/AgentManagement/Card.tsx';
import Section from '../components/AgentManagement/Section.tsx';
import CardItem from '../components/AgentManagement/CardItem.tsx';
import CardTitleAndDescription from '../components/AgentManagement/CardTitleAndDescription.tsx';
import Input from '@breakout/design-system/components/layout/input';
import Button from '@breakout/design-system/components/Button/index';
import { useEffect, useState } from 'react';
import { Plus, PlusIcon } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import useBrandingAgentConfigsQuery from '../queries/query/useAgentConfigsQuery';
import { useAgentConfigsMutation } from '../queries/mutation/useAgentConfigsMutation';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';
import { getTenantActiveAgentId, getTenantFromLocalStorage, getTenantIdentifier } from '@meaku/core/utils/index';
import CodeBlock from '@breakout/design-system/components/layout/CodeBlock';
import { trackError } from '@meaku/core/utils/error';
import toast from 'react-hot-toast';

const EntryPointsPage = () => {
  const tenantName = getTenantFromLocalStorage();
  const agentId = getTenantActiveAgentId();

  const subHeading =
    'Set up conversation starters that guide users toward meaningful interactions. Customize each element by clicking on any editable field.';

  const defaultScriptCode = `<script
  async
  src="https://script.getbreakout.ai/command_bar_widget.js"
  tenant-id="${tenantName}"
  agent-id="${agentId}">
</script>`;

  const gtmCompatibleScriptCode = `<script>
(function() {
  var script = document.createElement('script');
  script.setAttribute('src', 'https://script.getbreakout.ai/command_bar_widget.js');
  script.setAttribute('tenant-id', '${tenantName}');
  script.setAttribute('agent-id', '${agentId}');
  script.setAttribute('async', 'true');
  document.head.appendChild(script);
})();
</script>`;

  // State for form values
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  // Fetch agent configs
  const {
    data: agentConfig,
    isLoading,
    error,
  } = useBrandingAgentConfigsQuery({
    agentId,
    enabled: !!agentId,
  });

  // Setup mutation
  const { mutate: updateAgentConfig } = useAgentConfigsMutation();

  const updateConfig = (payload: Partial<AgentConfigPayload>) => {
    if (agentId) {
      try {
        updateAgentConfig({
          agentId,
          payload,
        });
        toast.success(`Configurations saved successfully`, {
          duration: 3000,
        });
      } catch (e) {
        trackError(error, {
          action: 'Entry Point update',
          component: 'updateConfig function',
          additionalData: {
            agentId,
            tenantName: getTenantIdentifier()?.['tenant-name'],
            errorMessage: 'Unable to update AgentConfig',
            payload: payload,
          },
        });
        toast.error('Please check if mandatory fields are filled.');
        console.error(e);
      }
    }
  };

  // Initialize form values from API data
  useEffect(() => {
    if (agentConfig) {
      const { metadata } = agentConfig;
      const welcomeMessage = metadata.welcome_message;
      // Set suggested questions
      setSuggestedQuestions(welcomeMessage.suggested_questions || []);
    }
  }, [agentConfig]);

  // Handler for adding a question
  const addQuestion = () => {
    if (suggestedQuestions.length < 2) {
      const newQuestions = [...suggestedQuestions, ''];
      setSuggestedQuestions(newQuestions);

      // Don't update API when adding an empty question
      // The API will be updated when the user fills in the question
    }
  };

  // Handler for updating a question (only updates local state)
  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...suggestedQuestions];
    updatedQuestions[index] = value;
    setSuggestedQuestions(updatedQuestions);

    // No API update on change - will be done on blur
  };

  // Handler for saving questions when input loses focus
  const saveQuestions = () => {
    // Filter out empty questions and update API
    const validQuestions = suggestedQuestions.filter((q) => q.trim() !== '');

    // Only update if we have valid questions and they're different from what we started with
    if (
      validQuestions.length > 0 &&
      JSON.stringify(validQuestions) !== JSON.stringify(agentConfig?.metadata.welcome_message.suggested_questions)
    ) {
      updateWelcomeMessage(validQuestions);

      // Update local state if we filtered out any empty questions
      if (validQuestions.length !== suggestedQuestions.length) {
        setSuggestedQuestions(validQuestions);
      }
    }
  };

  // Handler for updating welcome message
  const updateWelcomeMessage = (questions: string[]) => {
    if (!agentConfig) return;

    // Ensure no empty strings are sent to the API
    const validQuestions = questions.filter((q) => q.trim() !== '');

    if (validQuestions.length === 0) return;

    const payload: Partial<AgentConfigPayload> = {
      metadata: {
        ...agentConfig.metadata,
        welcome_message: {
          ...agentConfig.metadata.welcome_message,
          suggested_questions: validQuestions,
        },
      },
    };

    updateConfig(payload);
  };

  return (
    <PageContainer heading={'Entry Points'} subHeading={subHeading} isLoading={isLoading} error={error}>
      <Section heading={'Default Suggested Questions'}>
        <Card background={'GRAY25'} border={'GRAY200'}>
          {suggestedQuestions.length === 0 ? (
            <CardItem className="flex-col">
              <Typography textColor={'gray500'}>
                Help visitors start the conversation with pre-defined questions.
              </Typography>
              <Button variant="secondary" size="small" onClick={addQuestion} leftIcon={<Plus size={16} />}>
                Add Question
              </Button>
            </CardItem>
          ) : (
            <>
              {suggestedQuestions.map((question, index) => (
                <CardItem key={index} separator={index < suggestedQuestions.length - 1}>
                  <CardTitleAndDescription
                    title={`Question ${index + 1}`}
                    description={
                      index < 1
                        ? 'Create an engaging question that addresses a common user need or pain point.'
                        : undefined
                    }
                    isMandatoryField={false}
                  />
                  <Input
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    onBlur={saveQuestions}
                  />
                </CardItem>
              ))}
              {suggestedQuestions.length < 2 && (
                <CardItem className={'justify-end'}>
                  <Button
                    size={'small'}
                    buttonStyle={'rightIcon'}
                    variant={'secondary'}
                    rightIcon={<PlusIcon />}
                    onClick={addQuestion}
                  >
                    Add More
                  </Button>
                </CardItem>
              )}
            </>
          )}
        </Card>
      </Section>
      <Section heading={'Embedding the Agent Widget'}>
        <Card background={'GRAY25'} border={'GRAY200'}>
          <CardItem className={'flex-col'}>
            <CardTitleAndDescription
              description={
                'Instantly add your Breakout assistant to any webpage with this simple script. Your visitors can get answers and support without leaving your site.'
              }
              isMandatoryField={false}
            />
            <CodeBlock code={defaultScriptCode} language={'html'} />
          </CardItem>
          <CardItem className={'flex-col'}>
            <Typography variant={'caption-12-normal'} className="text-gray-500">
              For tag management systems (Google Tag Manager, etc.) and similar tools: If custom attributes don't work
              in your setup, use this JavaScript code instead:
            </Typography>
            <CodeBlock code={gtmCompatibleScriptCode} language={'html'} />
          </CardItem>
        </Card>
      </Section>
    </PageContainer>
  );
};

export default EntryPointsPage;
