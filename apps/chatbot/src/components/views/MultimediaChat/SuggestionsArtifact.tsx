import { SuggestionArtifactType } from '@meaku/core/types/chat';
import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import { useChatStore } from '../../../stores/useChatStore.ts';

interface IProps {
  artifact: SuggestionArtifactType;
}

const SuggestionsArtifact = ({ artifact: { suggested_questions, suggested_questions_type } }: IProps) => {
  const showSuggestionsArtifact: boolean = suggested_questions.length > 0 && suggested_questions_type === 'BUBBLE';

  const { handleSendUserMessage } = useWebSocketChat();

  const handleRemoveActiveChatArtifact = useChatStore((state) => state.handleRemoveActiveChatArtifact);

  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage(msg);
    handleRemoveActiveChatArtifact();
  };

  if (!showSuggestionsArtifact) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3">
      {suggested_questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => handleSuggestedQuestionOnClick(question)}
          className="group ml-auto flex max-w-fit items-center justify-center gap-1 rounded-full border-2 border-primary/10 bg-primary/15 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
          title={question}
        >
          <SparkleIcon className="!h-4 !w-4 fill-primary/60 transition-colors duration-300 ease-in-out group-hover:fill-white/60" />
          <span className="max-w-80 truncate text-sm font-medium">{question}</span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionsArtifact;
