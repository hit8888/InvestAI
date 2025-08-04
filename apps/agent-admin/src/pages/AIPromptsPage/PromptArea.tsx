import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import { Prompt } from '../../queries/query/usePrompts';
import { CreatePromptPayload, useDeletePrompt, useUpdatePrompt } from '../../queries/mutation/usePromptMutations';
import { RefObject, useState } from 'react';
import toast from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { UseMutationResult } from '@tanstack/react-query';
import InfoCard from '../../components/AgentManagement/InfoCard';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import Button from '@breakout/design-system/components/Button/index';
import PromptAreaFooterButtons from './PromptAreaFooterButtons';
import NoInfoProvidedSadFaceIcon from '@breakout/design-system/components/icons/no-info-sadface-icon';
import Typography from '@breakout/design-system/components/Typography/index';

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
  infoTitle: string;
  exampleDescription: string;
};

// TODO: Refactor to small components
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
  infoTitle,
  // exampleDescription,
}: PromptAreaProps) => {
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const commonPayload = {
    prompt_type: promptType,
    agent_function: 'response_generation',
  };

  // Queries and mutations
  const updatePromptMutation = useUpdatePrompt(agentId);
  const deletePromptMutation = useDeletePrompt(agentId);

  const handleClickOnEdit = () => {
    setClickedOnEdit(!clickedOnEdit);
    const updatedPrompts = [...localPrompts].filter((prompt) => prompt.prompt.trim() !== '');
    setLocalPrompts(updatedPrompts);
  };

  const handlePromptChange = (index: number, value: string) => {
    const updatedPrompts = [...localPrompts];
    updatedPrompts[index].prompt = value;
    setLocalPrompts(updatedPrompts);
  };

  const removeAndUpdatePrompts = (index: number) => {
    const updatedPrompts = [...localPrompts];
    updatedPrompts.splice(index, 1);
    setLocalPrompts(updatedPrompts);
  };

  const handleDeletePrompt = async (index: number) => {
    const promptToDelete = localPrompts[index];

    try {
      // Only call handleEmptyPrompt if the prompt exists in backend
      if (promptToDelete.id !== undefined && promptToDelete.prompt.trim() !== '') {
        await handleEmptyPrompt(promptToDelete);
        // Show success message only if not shown by handleEmptyPrompt
        if (promptToDelete.id === undefined) {
          toast.success('Prompt deleted successfully');
        }
      }

      // Removing the prompt at the same index
      removeAndUpdatePrompts(index);
      setClickedOnEdit(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(`Error deleting prompt: ${err?.response?.data?.details || 'Unknown error'}`);
      console.error('Error deleting prompt:', err);
    }
  };

  const handleEmptyPrompt = async (promptToSave: Prompt) => {
    if (promptToSave.id !== undefined) {
      await deletePromptMutation.mutateAsync({
        promptId: promptToSave.id,
      });
      // Update original value after successful deletion
      originalPromptsRef.current[promptToSave.id.toString()] = promptToSave.prompt;
      toast.success('Prompt made empty and deleted');
    }
  };

  const handleExistingPromptUpdate = async (promptToSave: Prompt) => {
    if (promptToSave.id !== undefined) {
      // Update existing prompt
      await updatePromptMutation.mutateAsync({
        promptId: promptToSave.id,
        payload: { prompt: promptToSave.prompt, ...commonPayload },
      });
      // Update original value after successful update
      originalPromptsRef.current[promptToSave.id.toString()] = promptToSave.prompt;
    }
  };

  const handleNewPromptCreation = async (promptToSave: Prompt, index: number) => {
    const newPrompt = await createPromptMutation.mutateAsync({
      prompt: promptToSave.prompt,
      agent_id: agentId,
      ...commonPayload,
    });

    const updatedPrompts = [...localPrompts];
    updatedPrompts[index] = newPrompt;
    setLocalPrompts(updatedPrompts);

    if (newPrompt.id !== undefined) {
      originalPromptsRef.current[newPrompt.id.toString()] = newPrompt.prompt;
    }
  };

  const handlePromptSave = async (index: number) => {
    const promptToSave = localPrompts[index];

    try {
      // Handle empty prompts
      if (!promptToSave.prompt.trim()) {
        await handleEmptyPrompt(promptToSave);
        removeAndUpdatePrompts(index);
        setClickedOnEdit(false);
        return;
      }

      // For existing prompts, check if the value has actually changed
      if (promptToSave.id) {
        const originalValue = originalPromptsRef.current[promptToSave.id.toString()];
        if (originalValue === promptToSave.prompt) {
          return;
        }
        await handleExistingPromptUpdate(promptToSave);
      } else {
        await handleNewPromptCreation(promptToSave, index);
      }
      setClickedOnEdit(false);

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

  // Check if prompts exist in the localPrompts array
  const arePromptsExisting = localPrompts.length > 0;

  // Show original prompts when not clicked on edit and prompts exist
  const showOriginalPrompts = !clickedOnEdit && arePromptsExisting;
  // Show no info provided when not clicked on edit and no prompts exist
  const showNoInfoProvided = !clickedOnEdit && !arePromptsExisting;
  // Show no info provided sad face icon when clicked on edit and no prompts exist
  const showNoInfoProvidedSadFace = clickedOnEdit && !arePromptsExisting;
  // Show prompts when clicked on edit and prompts exist
  const showPrompts = clickedOnEdit && arePromptsExisting;

  return (
    <>
      {showOriginalPrompts
        ? localPrompts.map((prompt, index) => (
            <InfoCard
              key={`original-prompt-${index}-${prompt.agent_id}`}
              title={infoTitle}
              description={prompt.prompt}
            />
          ))
        : null}
      {showNoInfoProvided && (
        <div className="flex w-full items-center justify-start gap-2.5 rounded-lg border border-gray-200 bg-gray-100 p-2">
          <NoInfoProvidedSadFaceIcon className="h-4 w-4 text-gray-500" />
          <Typography textColor="textSecondary" variant="caption-12-normal">
            No instructions added yet
          </Typography>
        </div>
      )}
      {showNoInfoProvidedSadFace && (
        <div className="flex w-full items-center justify-center gap-2.5">
          <NoInfoProvidedSadFaceIcon className="h-4 w-4 text-gray-500" />
          <Typography textColor="textSecondary" variant="caption-12-normal">
            No instructions added yet
          </Typography>
        </div>
      )}
      {showPrompts &&
        localPrompts.map((prompt, index) => (
          <div key={`new-prompt-${index}-${prompt.agent_id}`} className="flex w-full items-center justify-center gap-2">
            <ResizeTextarea
              value={prompt.prompt}
              minHeight={125}
              onChange={(e) => handlePromptChange(index, e.target.value)}
              onBlur={() => handlePromptSave(index)}
              placeholder={textareaPlaceholder}
              className="flex w-full items-center rounded-lg p-2 placeholder:text-gray-400
              focus:border focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
            <Button buttonStyle={'icon'} variant={'tertiary'} onClick={() => handleDeletePrompt(index)}>
              <DeleteIcon width={'16px'} height={'16px'} className="text-destructive-1000" />
            </Button>
          </div>
        ))}

      <PromptAreaFooterButtons
        arePromptsExisting={arePromptsExisting}
        clickedOnEdit={clickedOnEdit}
        setClickedOnEdit={setClickedOnEdit}
        handleClickOnEdit={handleClickOnEdit}
        agentId={agentId}
        localPrompts={localPrompts}
        setLocalPrompts={setLocalPrompts}
        isMutationPending={
          createPromptMutation.isPending || deletePromptMutation.isPending || updatePromptMutation.isPending
        }
      />
    </>
  );
};

export default PromptArea;
