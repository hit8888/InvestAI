import { cn } from "../../lib/cn";
import Ripple from "../animation/ripple";
import Logo from "./logo";

type Props = {
  inverted?: boolean;
  showRippleAnimation?: boolean;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
};

const WrappedLogo = ({
  inverted = false,
  showRippleAnimation = false,
  className = "",
}: Props) => {
  return (
    <div
      className={cn("ui-relative ui-rounded-full ui-p-2", {
        "ui-bg-primary": !inverted,
        "ui-bg-primary-foreground": inverted,
      })}
    >
      <Logo
        className={cn(
          "ui-h-6 ui-w-6",
          {
            "ui-text-primary-foreground": !inverted,
            "ui-text-primary": inverted,
          },
          className,
        )}
      />

      {showRippleAnimation && <Ripple />}
    </div>
  );
};

export default WrappedLogo;
