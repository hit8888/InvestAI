import { cn } from "../../lib/cn";

type Props = {
  question: string;
  inverted?: boolean;
  handleOnClick: (question: string) => void;
};

const SuggestedQuestion = (props: Props) => {
  const { question, inverted, handleOnClick } = props;

  return (
    <div className="ui-flex ui-items-center ui-justify-end">
      <button
        onClick={() => handleOnClick(question)}
        className={cn(
          "ui-rounded-md ui-px-4 ui-py-2 ui-text-left ui-text-[15px] ui-transition-all ui-duration-300",
          {
            "ui-bg-gray-200 ui-text-gray-800 hover:ui-bg-primary hover:ui-text-primary-foreground":
              !inverted,
            "ui-bg-primary ui-text-primary-foreground hover:ui-opacity-80":
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
