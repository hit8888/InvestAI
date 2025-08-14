import { useState } from 'react';
import { Button, Icons, Typography } from '@meaku/saral';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import {
  QualificationQuestionMetadataType,
  QualificationQuestionType,
  QualificationResponsesType,
  QualificationFlowArtifactProps,
} from '../../../../utils/artifact';
import QualificationSingleQuestion from './QualificationSingleQuestion';
import { MessageEventType } from '../../../../types/message';

type QualificationQuestionsProps = QualificationFlowArtifactProps & {
  handleIncrementSteps: () => void;
};

const QualificationQuestions = ({
  artifact,
  handleSendUserMessage,
  handleIncrementSteps,
}: QualificationQuestionsProps) => {
  const qualificationQuestions = artifact.content.qualification_questions;
  const { qualificationQuestionFormMetadata: qualificationMetadata } = artifact.metadata as {
    qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
  };
  const { trackEvent } = useCommandBarAnalytics();
  const [qualificationAnswers, setQualificationAnswers] = useState<Array<QualificationResponsesType>>([]);

  const handleSetAnswers = (question: string, answer: string, answer_type: string, id: string) => {
    setQualificationAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex((item) => item.question === question);

      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const newAnswers = [...prevAnswers];
        newAnswers[existingAnswerIndex] = { question, answer, answer_type, id };
        return newAnswers;
      } else {
        // Add new answer
        return [...prevAnswers, { question, answer, answer_type, id }];
      }
    });
  };

  const handleSubmitQualificationQuestions = () => {
    const response_data = {
      artifact_id: artifact.artifact_id ?? '',
      qualification_responses: [...qualificationAnswers],
    };
    handleSendUserMessage({
      message: '',
      overrides: {
        event_type: MessageEventType.QUALIFICATION_FORM_FILLED,
        event_data: response_data,
        response_id: artifact.response_id,
      },
    });
    handleIncrementSteps();

    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.QUALIFICATION_QUESTIONS_SUBMITTED, { ...response_data });
  };

  if (!qualificationQuestions?.length) return;

  const isSubmitBtnDisabled = qualificationQuestions.some(
    (question) => question.is_required && !qualificationAnswers.some((answer) => answer.question === question.question),
  );

  const dropdownOptions = qualificationQuestions.map((item) =>
    item.response_options.map((item) => item.value).filter((value): value is string => value !== undefined),
  );

  const handleEachQuestionSetAnswers = (answer: string | null, item: QualificationQuestionType) => {
    handleSetAnswers(item.question, answer || '', item.answer_type, item.id ?? '');
  };

  const hasQualificationMetadataFilledData = Array.isArray(qualificationMetadata.filled_data);

  return (
    <div className="flex h-full w-full max-w-lg flex-col justify-start overflow-auto p-1">
      <Typography className="mb-4 font-medium text-primary" variant="body-small">
        Step 2 of 2
      </Typography>
      {qualificationQuestions.map((item, index) => (
        <QualificationSingleQuestion
          key={item.question}
          isRequired={item.is_required}
          question={item.question}
          hasQualificationMetadataFilledData={hasQualificationMetadataFilledData}
          qualificationMetadata={qualificationMetadata}
          dropdownOptions={dropdownOptions[index]}
          answers={qualificationAnswers}
          handleSetAnswers={(answer) => handleEachQuestionSetAnswers(answer, item)}
        />
      ))}
      <div className="flex w-full justify-end pr-0 pt-4">
        {!hasQualificationMetadataFilledData ? (
          <Button
            autoFocus
            onClick={handleSubmitQualificationQuestions}
            disabled={isSubmitBtnDisabled}
            size="sm"
            className="gap-2"
          >
            Submit
            <Icons.ArrowRight className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default QualificationQuestions;
