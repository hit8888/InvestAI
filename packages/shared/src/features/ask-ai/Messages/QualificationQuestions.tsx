import { useState } from 'react';
import { Typography, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, Icons } from '@meaku/saral';
import { QualificationQuestionType } from '../../../utils/artifact';

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
  const [qualificationAnswers, setQualificationAnswers] = useState<Record<string, string>>(() => {
    // Initialize with filled data if available
    if (filledData && filledData.length > 0) {
      const initialAnswers: Record<string, string> = {};
      filledData.forEach((item) => {
        initialAnswers[item.id] = item.answer;
      });
      return initialAnswers;
    }
    return {};
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
    const answer = qualificationAnswers[question.id ?? ''];
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
                <SelectContent>
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
