import SparkleIcon from '@breakout/design-system/components/icons/sparkle';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
}

const Suggestion = ({ question, onSuggestedQuestionOnClick }: IProps) => {
  return (
    <div
      onClick={() => onSuggestedQuestionOnClick(question)}
      className="flex w-full cursor-pointer items-center gap-2 text-wrap rounded-full border-2 border-primary/60 bg-primary/80 hover:bg-primary/90 focus:bg-primary py-1 px-2 transition-all duration-300 ease-in-ou"
    >
      <div className="!h-4 !w-4">
        <SparkleIcon color='white' className="!h-4 !w-4 transition-colors duration-300 ease-in-out group-hover:fill-white" />
      </div>
      <div className="w-full text-sm text-white text-left font-medium">{question}</div>
    </div>
  );
};

export { Suggestion };
