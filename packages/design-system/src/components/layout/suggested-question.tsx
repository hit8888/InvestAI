import { cn } from "../../lib/cn";

type Props = {
  question: string;
  inverted?: boolean;
  handleOnClick: (question: string) => void;
};

const SuggestedQuestion = (props: Props) => {
  const { question, inverted, handleOnClick } = props;

  return (
    <div className="flex items-center justify-end">
      <button
        onClick={() => handleOnClick(question)}
        className={cn(
          "rounded-md px-4 py-2 text-left text-[15px] transition-all duration-300",
          {
            "bg-gray-200 text-gray-800 hover:bg-primary hover:text-primary-foreground":
              !inverted,
            "bg-primary text-primary-foreground hover:opacity-80":
              inverted,
          },
        )}
      >
        {question}
      </button>
    </div>
  );
};

export default SuggestedQuestion;
