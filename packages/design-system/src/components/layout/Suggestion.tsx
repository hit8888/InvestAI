import SparkleIcon from '@breakout/design-system/components/icons/sparkle';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
}

const Suggestion = ({ question, onSuggestedQuestionOnClick }: IProps) => {
  return (
    <div
      onClick={() => onSuggestedQuestionOnClick(question)}
      className="flex w-full cursor-pointer items-center gap-1 text-wrap rounded-full border-2 border-primary/10 bg-primary/10 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary/80 hover:text-white"
    >
      <div className="!h-4 !w-4">
        <SparkleIcon className="!h-4 !w-4 fill-primary/50 transition-colors duration-300 ease-in-out group-hover:fill-white" />
      </div>
      <div className="text-sm font-medium">{question}</div>
    </div>
  );
};

export { Suggestion };
