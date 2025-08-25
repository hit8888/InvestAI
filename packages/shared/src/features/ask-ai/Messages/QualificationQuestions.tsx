import { useState } from 'react';
import { Typography, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, Icons } from '@meaku/saral';
import { QualificationQuestionType } from '../../../utils/artifact';
import { useShadowRoot } from '../../../containers/ShadowRootProvider';

interface QualificationQuestionsProps {
  qualificationQuestions: QualificationQuestionType[];
  onSubmit?: (answers: Record<string, string>) => void;
  isFilled?: boolean;
  filledData?: Array<{ id: string; answer: string }>;
}

export const QualificationQuestions = ({
  qualificationQuestions,
  onSubmit,
  isFilled,
  filledData,
}: QualificationQuestionsProps) => {
  const { root: shadowRoot } = useShadowRoot();

  const [qualificationAnswers, setQualificationAnswers] = useState<Record<string, string>>(() => {
    const initialAnswers: Record<string, string> = {};

    // Initialize with filled data if available
    if (filledData && filledData.length > 0) {
      filledData.forEach((item) => {
        initialAnswers[item.id] = item.answer;
      });
    }

    // Initialize with default answers from default_answer_index
    qualificationQuestions.forEach((question) => {
      const questionId = question.id ?? '';
      // Only set default if not already filled from filledData
      if (
        !initialAnswers[questionId] &&
        question.default_answer_index !== undefined &&
        question.default_answer_index !== null
      ) {
        const defaultOption = question.response_options[question.default_answer_index - 1];
        if (defaultOption?.value) {
          initialAnswers[questionId] = defaultOption.value;
        }
      }
    });

    return initialAnswers;
  });

  if (qualificationQuestions.length === 0) {
    return null;
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(qualificationAnswers);
    }
  };

  // Check if all questions have been answered
  const areAllQuestionsAnswered = qualificationQuestions.every((question) => {
    const questionId = question.id ?? '';
    const answer = qualificationAnswers[questionId];
    return answer !== undefined && answer !== '';
  });

  return (
    <div className="w-full">
      {qualificationQuestions.map((question, index) => {
        const questionId = question.id ?? '';
        const answer = qualificationAnswers[questionId];
        const isQuestionFilled = isFilled && answer && answer !== '';

        return (
          <div
            key={question.id || `question-${index}`}
            className={isQuestionFilled ? 'mb-4 flex flex-col items-start gap-2' : 'mb-4 flex flex-col gap-4'}
          >
            <Typography variant="body-small" className="font-medium">
              {question.question}
            </Typography>
            {isQuestionFilled ? (
              <div className="inline-flex w-auto items-center gap-2 rounded-2xl bg-card p-3 px-4">
                <Icons.CheckCheck className="size-4 text-green-500" />
                <Typography variant="body-small" className="text-foreground">
                  {answer}
                </Typography>
              </div>
            ) : (
              <Select
                value={answer || ''}
                onValueChange={(value) => setQualificationAnswers((prev) => ({ ...prev, [questionId]: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an answer" />
                </SelectTrigger>
                <SelectContent portalContainer={shadowRoot}>
                  {question.response_options.map((option, optionIndex) => (
                    <SelectItem key={option.value || `option-${optionIndex}`} value={option.value ?? ''}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        );
      })}
      {!isFilled && (
        <div className="mt-4 flex w-full justify-end">
          <Button onClick={handleSubmit} disabled={!areAllQuestionsAnswered} size="sm" className="w-full gap-2">
            Submit
            <Icons.ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
