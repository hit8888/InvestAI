import { cn } from "../../lib/cn";
import ThumbIcon from "../icons/thumb";
import Button, { ButtonProps } from "./button";

interface IProps extends ButtonProps {
  isFilled?: boolean;
  isInverted?: boolean;
}

const FeedbackButton = (props: IProps) => {
  const { isFilled, isInverted, ...restProps } = props;

  return (
    <Button
      size="icon"
      className={cn("h-auto w-auto rounded-lg p-[6px]", {
        "bg-primary/25": isFilled,
        "bg-primary/10": !isFilled,
        "rotate-180 transform": isInverted,
      })}
      {...restProps}
    >
      <ThumbIcon
        className="!h-6 !w-6 text-primary"
        isFilled={isFilled}
      />
    </Button>
  );
};

export default FeedbackButton;
