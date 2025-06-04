import { Prompt } from '../../queries/query/usePrompts';

export type CommonAIPromptsProps = {
  title: string;
  promptType: string;
  textareaPlaceholder: string;
  exampleDescription: string;
  description: string;
};

export const CommonAIPrompts: CommonAIPromptsProps[] = [
  {
    title: 'Agent Personality',
    promptType: 'trait',
    textareaPlaceholder: 'Describe how the assistant should interact with users…',
    exampleDescription:
      'Act as a friendly, enthusiastic, and highly knowledgeable sales expert who is eager to help customers discover the best solutions.',
    description:
      'Set up your own rules to guide the assistant’s behavior. This field allows you to write specific instructions in plain English.',
  },
  {
    title: 'Instructions',
    promptType: 'directive',
    textareaPlaceholder: 'Type your custom instructions here…',
    exampleDescription: 'If the user asks anything about integrations, redirect them to the integrations page.',
    description:
      'Set up your own rules to guide the assistant’s behavior. This field allows you to write specific instructions in plain English.',
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
