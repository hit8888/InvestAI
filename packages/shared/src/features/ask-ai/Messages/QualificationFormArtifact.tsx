import { useState } from 'react';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

import { FormArtifactContent, QualificationQuestionType } from '../../../utils/artifact';
import { SendUserMessageParams, MessageEventType } from '../../../types/message';
import { QualificationQuestions } from './QualificationQuestions';

interface QualificationFormArtifactProps {
  artifactId: string;
  content: FormArtifactContent;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  isFilled: boolean;
  filledData: Array<{ id: string; answer: string }>;
  responseId?: string;
}

export const QualificationFormArtifact = ({
  artifactId,
  content,
  handleSendUserMessage,
  isFilled,
  responseId,
  filledData,
}: QualificationFormArtifactProps) => {
  const [, setIsAnimating] = useState(false);
  const { trackEvent } = useCommandBarAnalytics();

  const qualificationQuestions = (content?.qualification_questions ?? []) as QualificationQuestionType[];

  const handleQualificationQuestionsSubmit = (answers: Record<string, string>) => {
    // Transform answers into the required format
    const qualificationResponses = qualificationQuestions.map((question) => ({
      question: question.question,
      answer: answers[question.id ?? ''] || '',
      answer_type: 'DROP_DOWN',
      id: question.id ?? '',
    }));

    const eventData = {
      artifact_id: artifactId,
      qualification_responses: qualificationResponses,
    };

    handleSendUserMessage({
      message: '',
      overrides: {
        response_id: responseId,
        role: 'user',
        event_type: MessageEventType.QUALIFICATION_FORM_FILLED,
        event_data: eventData,
        timestamp: new Date().toISOString(),
      },
    });

    // Start animation
    setIsAnimating(true);

    // Delay the state change to allow for fade out animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match the CSS transition duration

    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.QUALIFICATION_QUESTIONS_SUBMITTED, { ...eventData });
  };

  return (
    <div className="mt-3 w-full border-none max-w-md px-4">
      <div className="flex w-full flex-col items-center gap-5 rounded-xl">
        <QualificationQuestions
          qualificationQuestions={qualificationQuestions}
          isFilled={isFilled}
          filledData={filledData}
          onSubmit={handleQualificationQuestionsSubmit}
        />
      </div>
    </div>
  );
};
