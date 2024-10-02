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
      className={cn("ui-h-auto ui-w-auto ui-rounded-lg ui-p-[6px]", {
        "ui-bg-primary/25": isFilled,
        "ui-bg-primary/10": !isFilled,
        "ui-rotate-180 ui-transform": isInverted,
      })}
      {...restProps}
    >
      <ThumbIcon
        className="!ui-h-4 !ui-w-4 ui-text-primary"
        isFilled={isFilled}
      />
    </Button>
  );
};

export default FeedbackButton;
