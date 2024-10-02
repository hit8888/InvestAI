import { cn } from "../../lib/cn";

interface IProps {
  text: string;
  isActive?: boolean;
  handleOnClick: () => void;
}

const RatingPill = (props: IProps) => {
  const { text, isActive, handleOnClick } = props;

  return (
    <button
      className={cn(
        "ui-rounded-full ui-border ui-border-primary ui-px-2 ui-py-1 ui-text-sm ui-text-primary ui-transition-colors ui-duration-300 ui-ease-in-out hover:ui-bg-primary/10",
        {
          "ui-bg-primary ui-text-white hover:ui-bg-primary/80": isActive,
        },
      )}
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
};

export default RatingPill;
