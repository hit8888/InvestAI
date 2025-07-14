import { SuggestionArtifactContent } from '@meaku/core/types/artifact';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { Suggestion } from './Suggestion.tsx';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import { ViewType } from '@meaku/core/types/common';
import MessageItemLayout, { Alignment, Gap, Padding, Orientation } from './MessageItemLayout.tsx';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface IProps {
  suggestedQuestionOrientation?: 'left' | 'right';
  artifact?: SuggestionArtifactContent;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  invertTextColor?: boolean;
  viewType?: ViewType;
}

const SuggestionsArtifact = ({
  artifact,
  handleSendUserMessage,
  suggestedQuestionOrientation = 'right',
  invertTextColor,
  viewType,
}: IProps) => {
  const isMobile = useIsMobile();
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const shortFormQuestions = artifact?.suggested_questions_short_form;
  const longFormQuestions = artifact?.suggested_questions;
  const questionsToShow =
    (isMobile ? (shortFormQuestions?.length ? shortFormQuestions : longFormQuestions) : longFormQuestions) ?? [];
  const showSuggestionsArtifact: boolean =
    questionsToShow.length > 0 && artifact?.suggested_questions_type === 'BUBBLE';

  const handleSuggestedQuestionOnClick = (originalIndex: number) => {
    const message = longFormQuestions?.[originalIndex] ?? questionsToShow[originalIndex];

    handleSendUserMessage({
      message: { content: message, event_data: {}, event_type: 'SUGGESTED_QUESTION_CLICKED' },
      message_type: 'EVENT',
    });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SUGGESTED_QUESTION_CLICKED, {
      message,
      isAgentOpen: true,
      artifact,
    });
  };

  const suggestionsRef = useElementScrollIntoView<HTMLDivElement>({
    shouldScroll: showSuggestionsArtifact,
    delay: 0,
  });

  if (!artifact || !showSuggestionsArtifact) {
    return <></>;
  }

  const sortedSuggestedQuestions = questionsToShow
    .map((question, index) => ({ question, originalIndex: index }))
    .sort((a, b) => b.question.length - a.question.length);

  return (
    <MessageItemLayout
      elementRef={suggestionsRef}
      orientation={Orientation.COLUMN}
      gap={Gap.SMALL}
      paddingInline={Padding.INLINE_LEFT_ONLY}
      align={suggestedQuestionOrientation as Alignment}
    >
      {sortedSuggestedQuestions.map(({ question, originalIndex }, index) => (
        <Suggestion
          key={question}
          question={question}
          onSuggestedQuestionOnClick={() => handleSuggestedQuestionOnClick(originalIndex)}
          itemIndex={index}
          isEntryPointQuestion={false}
          invertTextColor={invertTextColor}
          viewType={viewType}
        />
      ))}
    </MessageItemLayout>
  );
};

export default SuggestionsArtifact;
