import Button from '@breakout/design-system/components/Button/index';
import { EditIcon, PlusIcon, SaveIcon } from 'lucide-react';
import { Prompt } from '../../queries/query/usePrompts';
import { cn } from '@breakout/design-system/lib/cn';

type ButtonUI = {
  key: string;
  onClick: () => void;
  disabled: boolean;
  rightIcon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'system_secondary';
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
}: PromptAreaFooterButtonsProps) => {
  const handleAddPrompt = () => {
    setClickedOnEdit(true);
    // Check if there's already an empty prompt
    const hasEmptyPrompt = localPrompts.some((prompt) => prompt.prompt.trim() === '');

    if (!hasEmptyPrompt) {
      setLocalPrompts([...localPrompts, { prompt: '', agent_id: agentId }]);
    }
  };

  const getButtonUI = ({ key, onClick, disabled, rightIcon, label, variant = 'system_secondary' }: ButtonUI) => {
    // Generate ID based on button key
    const buttonId =
      key === 'add-prompt'
        ? 'controls-prompt-add-button'
        : key === 'save-or-edit'
          ? clickedOnEdit
            ? 'controls-prompt-save-button'
            : 'controls-prompt-edit-button'
          : `controls-prompt-${key}-button`;

    return (
      <Button
        id={buttonId}
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
        'justify-between pt-4': clickedOnEdit,
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
        </div>
      )}
      {arePromptsExisting &&
        getButtonUI({
          key: 'save-or-edit',
          onClick: handleClickOnEdit,
          disabled: isMutationPending,
          rightIcon: clickedOnEdit ? <SaveIcon /> : <EditIcon />,
          label: clickedOnEdit ? 'Save' : 'Edit',
          variant: 'system_secondary',
        })}
      {!arePromptsExisting &&
        !clickedOnEdit &&
        getButtonUI({
          key: 'add-prompt',
          onClick: handleAddPrompt,
          disabled: isMutationPending,
          variant: 'system_secondary',
          rightIcon: <PlusIcon />,
          label: 'Add',
        })}
    </div>
  );
};

export default PromptAreaFooterButtons;
