import { cn } from "../../lib/cn";

interface IProps {
  text: string;
  isActive?: boolean;
  disabled?: boolean;
  handleOnClick: () => void;
}

const RatingPill = (props: IProps) => {
  const { text, disabled, isActive, handleOnClick } = props;

  return (
    <button
      disabled={disabled}
      className={cn(
        "rounded-full border border-primary px-2 py-1 text-sm text-primary transition-colors duration-300 ease-in-out hover:bg-primary/10 disabled:opacity-60",
        {
          "bg-primary text-white hover:bg-primary/80": isActive,
        },
      )}
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
};

export default RatingPill;
