import { SuggestionArtifactContent } from '@meaku/core/types/chat';
import { Suggestion } from './Suggestion';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useChatbotAnalytics from '../../../hooks/useChatbotAnalytics.tsx';
import { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat.tsx';

interface IProps {
  artifact?: SuggestionArtifactContent;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
}

const SuggestionsArtifact = ({ artifact, handleSendUserMessage }: IProps) => {
  const { trackChatbotEvent } = useChatbotAnalytics();
  const showSuggestionsArtifact: boolean =
    (artifact?.suggested_questions.length ?? 0) > 0 && artifact?.suggested_questions_type === 'BUBBLE';

  const handleSuggestedQuestionOnClick = (message: string) => {
    handleSendUserMessage({ message });
    trackChatbotEvent(ANALYTICS_EVENT_NAMES.SUGGESTED_QUESTION_CLICKED, {
      message,
      isChatOpen: true,
      artifact,
    });
  };

  if (!artifact || !showSuggestionsArtifact) {
    return <></>;
  }

  return (
    <div className="flex w-full flex-col items-end gap-3">
      {artifact.suggested_questions.map((question) => (
        <div key={question} className="max-w-[80%] flex-wrap">
          <Suggestion question={question} onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick} />
        </div>
      ))}
    </div>
  );
};

export default SuggestionsArtifact;
