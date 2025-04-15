import { SuggestionArtifactContent } from '@meaku/core/types/artifact';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { Suggestion } from './Suggestion.tsx';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { cn } from '../../lib/cn.ts';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';

interface IProps {
  suggestedQuestionOrientation: 'left' | 'right';
  artifact?: SuggestionArtifactContent;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

const SuggestionsArtifact = ({ artifact, handleSendUserMessage, suggestedQuestionOrientation }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const showSuggestionsArtifact: boolean =
    (artifact?.suggested_questions.length ?? 0) > 0 && artifact?.suggested_questions_type === 'BUBBLE';

  const handleSuggestedQuestionOnClick = (message: string) => {
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

  const sortedSuggestedQuestions = [...artifact.suggested_questions].sort((a, b) => b.length - a.length);

  return (
    <div
      ref={suggestionsRef}
      className={cn('flex w-full flex-col items-start gap-2', {
        'items-end pl-11': suggestedQuestionOrientation === 'right',
        'pl-11 pr-6': suggestedQuestionOrientation === 'left',
      })}
    >
      {sortedSuggestedQuestions.map((question, index) => (
        <Suggestion
          key={question}
          question={question}
          onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
          itemIndex={index}
          isEntryPointQuestion={false}
        />
      ))}
    </div>
  );
};

export default SuggestionsArtifact;
