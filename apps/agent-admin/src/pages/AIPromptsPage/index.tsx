import PageContainer from '../../components/AgentManagement/PageContainer';
import { COMMON_AI_PROMPTS_DESCRIPTION, CommonAIPrompts } from './utils';
import SinglePromptTextarea from './SinglePromptTextarea';
import AgentResponseWordCount from './AgentResponseWordCount';

const AIPromptsPage = () => {
  const agentPersonality = CommonAIPrompts[0];
  const instructions = CommonAIPrompts[1];
  const agentResponseWordCount = CommonAIPrompts[2];

  return (
    <PageContainer heading={'AI Prompts'} subHeading={COMMON_AI_PROMPTS_DESCRIPTION}>
      <SinglePromptTextarea key={agentPersonality.title} {...agentPersonality} />
      <AgentResponseWordCount {...agentResponseWordCount} />
      <SinglePromptTextarea key={instructions.title} {...instructions} />
    </PageContainer>
  );
};

export default AIPromptsPage;
