import SparkleIcon from '@breakout/design-system/components/icons/sparkle';

interface IProps {
  question: string;
  onSuggestedQuestionOnClick: (msg: string) => void;
}

const Suggestion = ({ question, onSuggestedQuestionOnClick }: IProps) => {
  return (
    <button
      type="button"
      onClick={() => onSuggestedQuestionOnClick(question)}
      className="group flex items-center justify-center gap-1 rounded-full border-2 border-primary/10 bg-primary-50 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary/40"
    >
      <SparkleIcon className="!h-4 !w-4 fill-primary-400 transition-colors duration-300 ease-in-out group-hover:fill-white/60" />
      <span className="min-w-max text-sm font-medium">{question}</span>
    </button>
  );
};

export { Suggestion };
