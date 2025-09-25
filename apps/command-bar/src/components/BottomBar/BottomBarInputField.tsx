import React, { useCallback } from 'react';
import { RotatingQuestionButton } from './RotatingQuestionButton';
import { useTypewriter } from '@meaku/core/hooks/useTypewriter';

interface BottomBarInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (questionText?: string) => void;
  suggestedQuestions: string[];
  actionButtonSize: number;
  primaryPlaceholder: string | string[];
}

/**
 * Input field component for BottomCenterBar
 * Handles text input and suggested questions
 */
export const BottomBarInputField: React.FC<BottomBarInputFieldProps> = ({
  value,
  onChange,
  onSubmit,
  suggestedQuestions,
  actionButtonSize,
  primaryPlaceholder,
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit();
      }
    },
    [onSubmit],
  );

  return (
    <div
      style={{
        height: `${actionButtonSize}px`,
      }}
      className="flex w-full items-center gap-2 overflow-hidden rounded-[40px] bg-card pr-2"
    >
      <input
        type="text"
        placeholder={useTypewriter(primaryPlaceholder)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-full flex-1 rounded-[40px] bg-transparent px-3 text-xs focus:border-transparent focus:outline-none focus:ring-0"
      />
      <RotatingQuestionButton
        questions={suggestedQuestions}
        onQuestionClick={onSubmit}
        hasInput={value.trim().length > 0}
      />
    </div>
  );
};
