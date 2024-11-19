import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import { SuggestionArtifactType } from '@meaku/core/types/chat';

interface IProps {
  artifact?: SuggestionArtifactType;
  handleSendUserMessage: (msg: string) => void;
}

const SuggestionsArtifact = (props: IProps) => {
  const { artifact, handleSendUserMessage } = props;

  const showSuggestionsArtifact: boolean =
    (artifact?.suggested_questions.length ?? 0) > 0 && artifact?.suggested_questions_type === 'BUBBLE';

  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage(msg);
  };

  if (!artifact || !showSuggestionsArtifact) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-3">
      {artifact.suggested_questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => handleSuggestedQuestionOnClick(question)}
          className="group ml-auto flex max-w-fit items-center justify-center gap-1 rounded-full border-2 border-primary/10 bg-primary/15 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
          title={question}
        >
          <SparkleIcon className="!h-4 !w-4 fill-primary/60 transition-colors duration-300 ease-in-out group-hover:fill-white/60" />
          <span className="text-left text-sm font-medium">{question}</span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionsArtifact;
