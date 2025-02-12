import { SuggestionArtifactContent } from '@meaku/core/types/agent';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { Suggestion } from './Suggestion.tsx';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { cn } from '../../lib/cn.ts';

interface IProps {
  isAMessageBeingProcessed: boolean;
  suggestedQuestionOrientation: 'left' | 'right';
  artifact?: SuggestionArtifactContent;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
}

const SuggestionsArtifact = ({ artifact, handleSendUserMessage, isAMessageBeingProcessed, suggestedQuestionOrientation }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const showSuggestionsArtifact: boolean =
    (artifact?.suggested_questions.length ?? 0) > 0 && artifact?.suggested_questions_type === 'BUBBLE';

  const handleSuggestedQuestionOnClick = (message: string) => {
    handleSendUserMessage({ message });
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.SUGGESTED_QUESTION_CLICKED, {
      message,
      isAgentOpen: true,
      artifact,
    });
  };

  if (!artifact || !showSuggestionsArtifact) {
    return <></>;
  }

  return (
    <div className={cn("flex w-full flex-col items-start gap-3", {
      "items-end": suggestedQuestionOrientation === 'right',
      "pl-11 pr-6": suggestedQuestionOrientation === 'left'
    })}>
      {artifact.suggested_questions.map((question, index) => (
        <div key={question} className="max-w-[80%] flex-wrap">
          <Suggestion
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            question={question}
            onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick}
            itemIndex={index}
          />
        </div>
      ))}
    </div>
  );
};

export default SuggestionsArtifact;
