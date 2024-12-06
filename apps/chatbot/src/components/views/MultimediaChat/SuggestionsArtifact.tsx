import { SuggestionArtifactType } from '@meaku/core/types/chat';
import { Suggestion } from './Suggestion';

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
        <div key={question}>
          <Suggestion question={question} onSuggestedQuestionOnClick={handleSuggestedQuestionOnClick} />
        </div>
      ))}
    </div>
  );
};

export default SuggestionsArtifact;
