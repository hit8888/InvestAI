import Button from '@breakout/design-system/components/Button/index';
import { EditIcon, PlusIcon, SaveIcon } from 'lucide-react';
import RestartIcon from '@breakout/design-system/components/icons/restart-icon';
import { Prompt } from '../../queries/query/usePrompts';
import { cn } from '@breakout/design-system/lib/cn';

type PromptAreaFooterButtonsProps = {
  agentId: number;
  localPrompts: Prompt[];
  setLocalPrompts: (prompts: Prompt[]) => void;
  isMutationPending: boolean;
  clickedOnEdit: boolean;
  handleClickOnEdit: () => void;
  isSaveButtonDisabled: boolean;
};

const PromptAreaFooterButtons = ({
  agentId,
  localPrompts,
  setLocalPrompts,
  isMutationPending,
  clickedOnEdit,
  handleClickOnEdit,
  isSaveButtonDisabled,
}: PromptAreaFooterButtonsProps) => {
  const handleAddPrompt = () => {
    // Check if there's already an empty prompt
    const hasEmptyPrompt = localPrompts.some((prompt) => prompt.prompt.trim() === '');

    if (!hasEmptyPrompt) {
      setLocalPrompts([...localPrompts, { prompt: '', agent_id: agentId }]);
    }
  };

  const handleResetToDefault = () => {
    setLocalPrompts([]);
  };

  return (
    <div
      className={cn('flex w-full justify-end', {
        'justify-between border-t border-gray-200 pt-4': clickedOnEdit,
      })}
    >
      {clickedOnEdit && (
        <div className="flex w-full flex-1 items-start gap-4">
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
          <Button
            size={'small'}
            buttonStyle={'rightIcon'}
            variant={'secondary'}
            rightIcon={<RestartIcon />}
            onClick={handleResetToDefault}
            disabled={isMutationPending}
          >
            Reset to Default
          </Button>
        </div>
      )}
      <Button
        size={'small'}
        buttonStyle={'rightIcon'}
        variant={'primary'}
        rightIcon={clickedOnEdit ? <SaveIcon /> : <EditIcon />}
        onClick={handleClickOnEdit}
        disabled={isMutationPending || isSaveButtonDisabled}
      >
        {clickedOnEdit ? 'Save' : 'Edit'}
      </Button>
    </div>
  );
};

export default PromptAreaFooterButtons;
