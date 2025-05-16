import { useEffect, useRef, useState } from 'react';
import PageContainer from '../components/AgentManagement/PageContainer.tsx';
import Card from '../components/AgentManagement/Card.tsx';
import TextArea from '@breakout/design-system/components/layout/textarea';
import InfoCard from '../components/AgentManagement/InfoCard.tsx';
import Button from '@breakout/design-system/components/Button/index';
import { PlusIcon } from 'lucide-react';
import { Prompt, usePrompts } from '../queries/query/usePrompts';
import { useCreatePrompt, useUpdatePrompt } from '../queries/mutation/usePromptMutations';
import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import toast from 'react-hot-toast';

const InstructionsPage = () => {
  const subHeading =
    "Set up your own rules to guide the assistant's behavior. This field allows you to write specific instructions in plain English.";

  // In a real app, this would come from context, route params, etc.
  const agentId = 1;

  const [localPrompts, setLocalPrompts] = useState<Prompt[]>([]);
  // Keep track of original prompt values to detect changes
  const originalPromptsRef = useRef<Record<string, string>>({});

  // Queries and mutations
  const { data: prompts, isLoading, error } = usePrompts(agentId);
  const createPromptMutation = useCreatePrompt(agentId);
  const updatePromptMutation = useUpdatePrompt(agentId);

  // Initialize local state when prompts are loaded
  useEffect(() => {
    if (prompts) {
      setLocalPrompts(prompts.length > 0 ? prompts : [{ prompt: '', agent_id: agentId }]);

      // Store original values
      const originalValues: Record<string, string> = {};
      prompts.forEach((prompt) => {
        if (prompt.id) {
          originalValues[prompt.id.toString()] = prompt.prompt;
        }
      });
      originalPromptsRef.current = originalValues;
    }
  }, [prompts, agentId]);

  const handleAddPrompt = () => {
    // Check if there's already an empty prompt
    const hasEmptyPrompt = localPrompts.some((prompt) => prompt.prompt.trim() === '');

    if (!hasEmptyPrompt) {
      setLocalPrompts([...localPrompts, { prompt: '', agent_id: agentId }]);
    }
  };

  const handlePromptChange = (index: number, value: string) => {
    const updatedPrompts = [...localPrompts];
    updatedPrompts[index].prompt = value;
    setLocalPrompts(updatedPrompts);
  };

  const handlePromptSave = async (index: number) => {
    const promptToSave = localPrompts[index];

    // Don't save empty prompts
    if (!promptToSave.prompt.trim()) {
      return;
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
          payload: { prompt: promptToSave.prompt },
        });

        // Update original value after successful save
        originalPromptsRef.current[promptToSave.id.toString()] = promptToSave.prompt;
      } else {
        // Create new prompt
        const newPrompt = await createPromptMutation.mutateAsync({
          prompt: promptToSave.prompt,
          agent_id: agentId,
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

      toast.success(`Instructions saved successfully`, {
        duration: 3000,
      });
    } catch (err) {
      trackError(error, {
        action: 'Prompt save/update',
        component: 'handlePromptSave function',
        additionalData: {
          agentId: agentId,
          tenantName: getTenantIdentifier()?.['tenant-name'],
          errorMessage: 'Unable to save Instructions',
          payload: promptToSave.prompt,
        },
      });
      toast.error('Please check if mandatory fields are filled.');
      console.error('Error saving prompt:', err);
    }
  };

  // Initialize with an empty prompt if none exist
  const displayPrompts = localPrompts.length > 0 ? localPrompts : [{ prompt: '', agent_id: agentId }];

  return (
    <PageContainer heading={'Instructions'} subHeading={subHeading} isLoading={isLoading} error={error}>
      <Card background={'GRAY25'} border={'GRAY200'}>
        <InfoCard
          title={'Example:'}
          description={'If the user asks anything about integrations, redirect them to the integrations page.'}
        />

        {displayPrompts.map((prompt, index) => (
          <TextArea
            key={prompt.id || `new-prompt-${index}`}
            value={prompt.prompt}
            onChange={(e) => handlePromptChange(index, e.target.value)}
            onBlur={() => handlePromptSave(index)}
            placeholder="Type your custom instructions here…"
            className="flex min-h-20 w-full items-center rounded-lg p-2 placeholder:text-gray-400"
          />
        ))}

        <div className="flex w-full flex-col items-start">
          <Button
            size={'small'}
            buttonStyle={'rightIcon'}
            variant={'secondary'}
            rightIcon={<PlusIcon />}
            onClick={handleAddPrompt}
            disabled={createPromptMutation.isPending}
          >
            Add More
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
};

export default InstructionsPage;
