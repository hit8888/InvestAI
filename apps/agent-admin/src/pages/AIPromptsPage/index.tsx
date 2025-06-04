import PageContainer from '../../components/AgentManagement/PageContainer';
import { CommonAIPrompts } from './utils';
import SinglePromptTextarea from './SinglePromptTextarea';

const AIPromptsSubHeading = "Guide your AI assistant's behavior and personality to optimize its interactions.";

const AIPromptsPage = () => {
  return (
    <PageContainer heading={'AI Prompts'} subHeading={AIPromptsSubHeading}>
      {CommonAIPrompts.map((prompt) => (
        <SinglePromptTextarea
          key={prompt.title}
          title={prompt.title}
          promptType={prompt.promptType}
          description={prompt.description}
          textareaPlaceholder={prompt.textareaPlaceholder}
          exampleDescription={prompt.exampleDescription}
        />
      ))}
    </PageContainer>
  );
};

export default AIPromptsPage;
