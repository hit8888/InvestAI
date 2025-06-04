import Button from '@breakout/design-system/components/Button/index';
import { PlusIcon } from 'lucide-react';
import { Prompt } from '../../queries/query/usePrompts';

type AddMorePromptButtonProps = {
  agentId: number;
  localPrompts: Prompt[];
  setLocalPrompts: (prompts: Prompt[]) => void;
  isMutationPending: boolean;
};

const AddMorePromptButton = ({
  agentId,
  localPrompts,
  setLocalPrompts,
  isMutationPending,
}: AddMorePromptButtonProps) => {
  const handleAddPrompt = () => {
    // Check if there's already an empty prompt
    const hasEmptyPrompt = localPrompts.some((prompt) => prompt.prompt.trim() === '');

    if (!hasEmptyPrompt) {
      setLocalPrompts([...localPrompts, { prompt: '', agent_id: agentId }]);
    }
  };
  return (
    <div className="flex w-full flex-col items-start">
      <Button
        size={'small'}
        buttonStyle={'rightIcon'}
        variant={'secondary'}
        rightIcon={<PlusIcon />}
        onClick={handleAddPrompt}
        disabled={isMutationPending}
      >
        Add More
      </Button>
    </div>
  );
};

export default AddMorePromptButton;
