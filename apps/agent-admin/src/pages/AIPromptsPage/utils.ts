import { Prompt } from '../../queries/query/usePrompts';

export type CommonAIPromptsProps = {
  title: string;
  promptType: string;
  textareaPlaceholder: string;
  exampleDescription: string;
  description: string;
  infoTitle: string;
};

export const COMMON_AI_PROMPTS_DESCRIPTION =
  'Set up your own rules to guide the assistant’s behavior. This field allows you to write specific instructions in plain English.';

export const CommonAIPrompts: CommonAIPromptsProps[] = [
  {
    title: 'Agent Personality',
    promptType: 'trait',
    textareaPlaceholder: 'Describe how the assistant should interact with users…',
    exampleDescription: 'Act as a helpful and clear product expert who guides users with confidence and empathy.',
    description: `Guide your AI assistant's behavior and personality to optimize its interactions.`,
    infoTitle: 'Instruction for Agent Personality:',
  },
  {
    title: 'Instructions',
    promptType: 'directive',
    textareaPlaceholder: 'Type your custom instructions here…',
    exampleDescription:
      'If the user asks anything product-related, guide them to the most relevant feature using clear, concise language. Be helpful, not overwhelming.',
    description: COMMON_AI_PROMPTS_DESCRIPTION,
    infoTitle: 'General Instructions:',
  },
  {
    title: 'Agent Response Word Count',
    promptType: '',
    textareaPlaceholder: '',
    exampleDescription: '',
    description: `Select the style of agent responses. Brief, standard or detailed.`,
    infoTitle: '',
  },
];

export const getFilterAppliedValues = (promptType: string, agentId: number) => {
  return [
    {
      field: 'prompt_type',
      operator: 'eq',
      value: promptType,
    },
    {
      field: 'agent_function',
      operator: 'eq',
      value: 'response_generation',
    },
    {
      field: 'base_prompt',
      operator: 'eq',
      value: null,
    },
    {
      field: 'agent_id',
      operator: 'eq',
      value: agentId,
    },
  ];
};

export const getSortedPrompts = (prompts: Prompt[]) => {
  return [...prompts]?.sort((a, b) => {
    if (!a.created_on || !b.created_on) return 0;
    return new Date(a.created_on).getTime() - new Date(b.created_on).getTime();
  });
};
