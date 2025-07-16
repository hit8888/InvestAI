import Button from '@breakout/design-system/components/Button/index';
import { EditIcon, PlusIcon, SaveIcon } from 'lucide-react';
import RestartIcon from '@breakout/design-system/components/icons/restart-icon';
import { Prompt } from '../../queries/query/usePrompts';
import { cn } from '@breakout/design-system/lib/cn';

type ButtonUI = {
  key: string;
  onClick: () => void;
  disabled: boolean;
  rightIcon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
};

type PromptAreaFooterButtonsProps = {
  arePromptsExisting: boolean;
  agentId: number;
  localPrompts: Prompt[];
  setLocalPrompts: (prompts: Prompt[]) => void;
  isMutationPending: boolean;
  clickedOnEdit: boolean;
  setClickedOnEdit: (clickedOnEdit: boolean) => void;
  handleClickOnEdit: () => void;
  handleResetToDefault: () => void;
};

const PromptAreaFooterButtons = ({
  arePromptsExisting,
  agentId,
  localPrompts,
  setLocalPrompts,
  isMutationPending,
  clickedOnEdit,
  setClickedOnEdit,
  handleClickOnEdit,
  handleResetToDefault,
}: PromptAreaFooterButtonsProps) => {
  const handleAddPrompt = () => {
    setClickedOnEdit(true);
    // Check if there's already an empty prompt
    const hasEmptyPrompt = localPrompts.some((prompt) => prompt.prompt.trim() === '');

    if (!hasEmptyPrompt) {
      setLocalPrompts([...localPrompts, { prompt: '', agent_id: agentId }]);
    }
  };

  const getButtonUI = ({ key, onClick, disabled, rightIcon, label, variant = 'secondary' }: ButtonUI) => {
    return (
      <Button
        key={key}
        size={'small'}
        buttonStyle={'rightIcon'}
        variant={variant}
        rightIcon={rightIcon}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  };

  return (
    <div
      className={cn('flex w-full justify-end', {
        'justify-between border-t border-gray-200 pt-4': clickedOnEdit,
      })}
    >
      {clickedOnEdit && (
        <div className="flex w-full flex-1 items-start gap-4">
          {getButtonUI({
            key: 'add-prompt',
            onClick: handleAddPrompt,
            disabled: isMutationPending,
            rightIcon: <PlusIcon />,
            label: 'Add',
          })}
          {getButtonUI({
            key: 'reset-to-default',
            onClick: handleResetToDefault,
            disabled: isMutationPending,
            rightIcon: <RestartIcon />,
            label: 'Reset to Default',
          })}
        </div>
      )}
      {arePromptsExisting &&
        getButtonUI({
          key: 'save-or-edit',
          onClick: handleClickOnEdit,
          disabled: isMutationPending,
          rightIcon: clickedOnEdit ? <SaveIcon /> : <EditIcon />,
          label: clickedOnEdit ? 'Save' : 'Edit',
          variant: 'primary',
        })}
      {!arePromptsExisting &&
        !clickedOnEdit &&
        getButtonUI({
          key: 'add-prompt',
          onClick: handleAddPrompt,
          disabled: isMutationPending,
          variant: 'primary',
          rightIcon: <PlusIcon />,
          label: 'Add',
        })}
    </div>
  );
};

export default PromptAreaFooterButtons;
