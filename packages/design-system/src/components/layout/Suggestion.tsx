import SparkleIcon from '@breakout/design-system/components/icons/sparkle';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
  itemIndex: number;
}

const Suggestion = ({ question, onSuggestedQuestionOnClick, itemIndex }: IProps) => {
  const handleClickOnSuggestedQuestion = (question: string) => {
    onSuggestedQuestionOnClick(question);
  };
  return (
    <div
      onClick={() => handleClickOnSuggestedQuestion(question)}
      className="ease-in-ou flex w-full cursor-pointer items-center gap-2 text-wrap rounded-full border-2 border-primary/60 bg-primary/80 px-2 py-1 transition-all duration-300 hover:bg-primary/90 focus:bg-primary"
      data-testid={`suggestion-item-${itemIndex}`}
    >
      <div className="!h-4 !w-4">
        <SparkleIcon
          color="white"
          className="!h-4 !w-4 transition-colors duration-300 ease-in-out group-hover:fill-white"
        />
      </div>
      <div className="w-full text-left text-sm font-medium text-white">{question}</div>
    </div>
  );
};

export { Suggestion };
