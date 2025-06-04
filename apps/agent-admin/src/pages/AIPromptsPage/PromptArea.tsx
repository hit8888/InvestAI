import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import { Prompt } from '../../queries/query/usePrompts';
import { CreatePromptPayload, useDeletePrompt, useUpdatePrompt } from '../../queries/mutation/usePromptMutations';
import { RefObject } from 'react';
import toast from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { UseMutationResult } from '@tanstack/react-query';

type PromptAreaProps = {
  title: string;
  promptType: string;
  agentId: number;
  textareaPlaceholder: string;
  localPrompts: Prompt[];
  setLocalPrompts: (prompts: Prompt[]) => void;
  originalPromptsRef: RefObject<Record<string, string>>;
  createPromptMutation: UseMutationResult<Prompt, Error, CreatePromptPayload, unknown>;
  error: Error | null;
};
const PromptArea = ({
  title,
  promptType,
  agentId,
  textareaPlaceholder,
  localPrompts,
  setLocalPrompts,
  originalPromptsRef,
  createPromptMutation,
  error,
}: PromptAreaProps) => {
  const commonPayload = {
    prompt_type: promptType,
    agent_function: 'response_generation',
  };

  // Queries and mutations
  const updatePromptMutation = useUpdatePrompt(agentId);
  const deletePromptMutation = useDeletePrompt(agentId);

  const handlePromptChange = (index: number, value: string) => {
    const updatedPrompts = [...localPrompts];
    updatedPrompts[index].prompt = value;
    setLocalPrompts(updatedPrompts);
  };

  const handlePromptSave = async (index: number) => {
    const promptToSave = localPrompts[index];

    // Delete empty prompts and show toast
    if (!promptToSave.prompt.trim()) {
      if (promptToSave.id) {
        // delete existing prompt
        await deletePromptMutation.mutateAsync({
          promptId: promptToSave.id,
        });

        // Update original value after successful deletion
        originalPromptsRef.current[promptToSave.id.toString()] = promptToSave.prompt;
        toast.success('Prompt made empty and deleted');
      }
    }

    // For existing prompts, check if the value has actually changed
    if (promptToSave.id) {
      const originalValue = originalPromptsRef.current[promptToSave.id.toString()];
      // Skip if the prompt hasn't changed
      if (originalValue === promptToSave.prompt) {
        return;
      }
    }

    try {
      if (promptToSave.id) {
        // Update existing prompt
        await updatePromptMutation.mutateAsync({
          promptId: promptToSave.id,
          payload: { prompt: promptToSave.prompt, ...commonPayload },
        });

        // Update original value after successful save
        originalPromptsRef.current[promptToSave.id.toString()] = promptToSave.prompt;
      } else {
        // Create new prompt
        const newPrompt = await createPromptMutation.mutateAsync({
          prompt: promptToSave.prompt,
          agent_id: agentId,
          ...commonPayload,
        });

        // Update local state with the new prompt ID
        const updatedPrompts = [...localPrompts];
        updatedPrompts[index] = newPrompt;
        setLocalPrompts(updatedPrompts);

        // Store original value for the new prompt
        if (newPrompt.id) {
          originalPromptsRef.current[newPrompt.id.toString()] = newPrompt.prompt;
        }
      }

      toast.success(`${title} saved successfully`, {
        duration: 3000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      trackError(error, {
        action: 'Prompt save/update',
        component: 'handlePromptSave function',
        additionalData: {
          agentId,
          tenantName: getTenantIdentifier()?.['tenant-name'],
          errorMessage: `Unable to save ${title}`,
          payload: promptToSave.prompt,
          error: err?.response?.data,
        },
      });
      // Reset the prompt to an empty string
      handlePromptChange(index, '');
      toast.error(`Error for ${title}: ${err?.response?.data?.details}`);
      console.error('Error saving prompt:', err);
    }
  };

  // Initialize with an empty prompt if none exist
  const displayPrompts = localPrompts.length > 0 ? localPrompts : [{ prompt: '', agent_id: agentId }];
  return (
    <>
      {displayPrompts.map((prompt, index) => (
        <ResizeTextarea
          key={prompt.agent_id || `new-prompt-${index}`}
          value={prompt.prompt}
          minHeight={125}
          onChange={(e) => handlePromptChange(index, e.target.value)}
          onBlur={() => handlePromptSave(index)}
          placeholder={textareaPlaceholder}
          className="flex w-full items-center rounded-lg p-2 placeholder:text-gray-400 focus:border focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
      ))}
    </>
  );
};

export default PromptArea;
