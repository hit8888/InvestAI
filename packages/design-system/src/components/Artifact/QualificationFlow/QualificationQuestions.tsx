import { useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { cn } from '../../../lib/cn';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { AgentEventType } from '@meaku/core/types/webSocketData';
import { QualificationFlowArtifactProps } from './QualificationTypes';
import ArrowRight from '../../icons/ArrowRight';
import { QualificationQuestionMetadataType, QualificationResponsesType } from '@meaku/core/types/artifact';
import QualificationSingleQuestion from './QualificationSingleQuestion';

const MAX_QUESTION_IN_DISPLAY_WITHOUT_SCROLL = 4;

const QualificationQuestions = ({ artifact, handleSendUserMessage }: QualificationFlowArtifactProps) => {
  const qualificationQuestions = artifact.content.qualification_questions;
  const qualificationMetadata = artifact.metadata as QualificationQuestionMetadataType;
  const { trackAgentbotEvent } = useAgentbotAnalytics();
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
      message: { content: '', event_type: AgentEventType.QUALIFICATION_FORM_FILLED, event_data: response_data },
      message_type: 'EVENT', // TODO: Need to add the Event type When user edits the form and submit it
    });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.QUALIFICATION_QUESTIONS_SUBMITTED, { ...response_data });
  };

  if (!qualificationQuestions?.length) return;

  const isSubmitBtnDisabled = qualificationQuestions.some(
    (question) => question.is_required && !qualificationAnswers.some((answer) => answer.question === question.question),
  );

  return (
    <div className="flex h-full w-full flex-col justify-start gap-10 pb-10">
      <div
        className={cn('flex flex-col items-start justify-center gap-16 self-stretch pl-4', {
          'max-h-[750px] justify-start overflow-y-auto':
            qualificationQuestions.length > MAX_QUESTION_IN_DISPLAY_WITHOUT_SCROLL, // Taking a threshold
        })}
      >
        {qualificationQuestions.map((item) => (
          <QualificationSingleQuestion
            key={item.question}
            isRequired={item.is_required}
            question={item.question}
            qualificationMetadata={qualificationMetadata}
            dropdownOptions={item.response_options
              .map((item) => item.value)
              .filter((value): value is string => value !== undefined)}
            handleSetAnswers={(answer) =>
              handleSetAnswers(item.question, answer || '', item.answer_type, item.id ?? '')
            }
          />
        ))}
      </div>
      <div className="flex w-full justify-end pr-2">
        {!qualificationMetadata.is_filled ? (
          <Button
            className="h-14 w-36 rounded-xl text-2xl"
            onClick={handleSubmitQualificationQuestions}
            disabled={isSubmitBtnDisabled}
          >
            Submit
            <ArrowRight className="text-white" width="24" height="24" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default QualificationQuestions;
