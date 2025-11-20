import { useEffect, useMemo, useRef, useState } from 'react';
import { CommonControlsProps, getFilterAppliedValues, getSortedPrompts } from './utils.ts';
import { Prompt, usePrompts } from '../../queries/query/usePrompts.ts';
import { useCreatePrompt } from '../../queries/mutation/usePromptMutations.ts';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import LoadingState from './LoadingState.tsx';
import PromptHeader from './PromptHeader.tsx';
import PromptArea from './PromptArea.tsx';
import { useSessionStore } from '../../stores/useSessionStore';

const SinglePromptTextarea = ({
  title,
  infoTitle,
  promptType,
  description,
  exampleDescription,
  textareaPlaceholder,
}: CommonControlsProps) => {
  const agentId = useSessionStore((state) => state.activeTenant?.agentId ?? 1);

  const allAppliedFilterValues = useMemo(() => {
    return getFilterAppliedValues(promptType, agentId);
  }, [promptType, agentId]);

  const payloadData = {
    filters: allAppliedFilterValues,
    page: 1,
    page_size: 50,
  };

  const { data: prompts, isLoading, error } = usePrompts(payloadData);

  const [localPrompts, setLocalPrompts] = useState<Prompt[]>([]);
  // Keep track of original prompt values to detect changes
  const originalPromptsRef = useRef<Record<string, string>>({});

  // Queries and mutations
  const createPromptMutation = useCreatePrompt(agentId);

  // Initialize local state when prompts are loaded
  useEffect(() => {
    if (prompts) {
      const sortedPrompts = getSortedPrompts(prompts);
      setLocalPrompts(sortedPrompts);

      // Store original values
      const originalValues: Record<string, string> = {};
      sortedPrompts.forEach((prompt) => {
        if (prompt.id) {
          originalValues[prompt.id.toString()] = prompt.prompt;
        }
      });
      originalPromptsRef.current = originalValues;
    }
  }, [prompts, agentId]);

  if (isLoading) {
    return <LoadingState title={title} description={description} />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <PromptArea
        title={title}
        promptType={promptType}
        agentId={agentId}
        textareaPlaceholder={textareaPlaceholder}
        localPrompts={localPrompts}
        setLocalPrompts={setLocalPrompts}
        originalPromptsRef={originalPromptsRef}
        createPromptMutation={createPromptMutation}
        error={error}
        infoTitle={infoTitle}
        exampleDescription={exampleDescription}
      />
    </div>
  );
};

export default SinglePromptTextarea;
