import { useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { cn } from '../../../lib/cn';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { AgentEventType } from '@meaku/core/types/webSocketData';
import ArrowRight from '../../icons/ArrowRight';
import {
  QualificationQuestionMetadataType,
  QualificationQuestionType,
  QualificationResponsesType,
  QualificationFlowArtifactProps,
} from '@meaku/core/types/artifact';
import QualificationSingleQuestion from './QualificationSingleQuestion';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import Typography from '../../Typography';

const MAX_QUESTION_IN_DISPLAY_WITHOUT_SCROLL = 4;

type QualificationQuestionsProps = QualificationFlowArtifactProps & {
  steps: number;
};

const QualificationQuestions = ({ artifact, handleSendUserMessage, steps }: QualificationQuestionsProps) => {
  const isMobile = useIsMobile();
  const qualificationQuestions = artifact.content.qualification_questions;
  const { qualificationQuestionFormMetadata: qualificationMetadata } = artifact.metadata as {
    qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
  };
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
      message_type: 'EVENT',
      response_id: artifact.response_id,
    });

    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.QUALIFICATION_QUESTIONS_SUBMITTED, { ...response_data });
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
    <div
      className={cn([
        'flex h-full w-full flex-col justify-start gap-10 h-xs:justify-center h-sm:justify-center',
        isMobile && 'max-w-lg gap-4 rounded-2xl bg-transparent_gray_3 p-4',
      ])}
    >
      {isMobile && (
        <Typography className="w-fit" variant="label-16-semibold" textColor="gray500">{`${steps} of 2`}</Typography>
      )}
      <div
        className={cn([
          'flex flex-col items-start justify-center gap-16 self-stretch pl-4',
          qualificationQuestions.length > MAX_QUESTION_IN_DISPLAY_WITHOUT_SCROLL &&
            'max-h-[750px] justify-start overflow-y-auto', // Taking a threshold
          isMobile && 'gap-10 pl-0',
        ])}
      >
        {qualificationQuestions.map((item, index) => (
          <QualificationSingleQuestion
            key={item.question}
            isRequired={item.is_required}
            question={item.question}
            hasQualificationMetadataFilledData={hasQualificationMetadataFilledData}
            qualificationMetadata={qualificationMetadata}
            dropdownOptions={dropdownOptions[index]}
            handleSetAnswers={(answer) => handleEachQuestionSetAnswers(answer, item)}
          />
        ))}
      </div>
      <div className={cn(['flex w-full justify-end pr-2', isMobile && 'pr-0 pt-6'])}>
        {!hasQualificationMetadataFilledData ? (
          <Button
            autoFocus
            className={cn([!isMobile && 'h-14 w-36 rounded-xl text-2xl'])}
            onClick={handleSubmitQualificationQuestions}
            buttonStyle={isMobile ? 'rightIcon' : 'default'}
            variant="system"
            rightIcon={<ArrowRight className="text-white" width={'24'} height={'24'} />}
            disabled={isSubmitBtnDisabled}
          >
            Submit
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default QualificationQuestions;
