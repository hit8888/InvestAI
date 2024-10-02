import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import Ripple from "../animation/ripple";
import Logo from "./logo";

const wrapperStyles = cva("ui-relative ui-rounded-full", {
  variants: {
    size: {
      sm: "ui-p-2",
      lg: "ui-p-5",
    },
    inverted: {
      true: "ui-bg-primary-foreground ui-text-primary",
      false: "ui-bg-primary ui-text-primary-foreground",
    },
  },
  defaultVariants: {
    size: "sm",
    inverted: false,
  },
});

const logoStyles = cva("", {
  variants: {
    size: {
      sm: "ui-h-6 ui-w-6",
      lg: "!ui-h-14 !ui-w-14",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

type WrapperStylesProps = VariantProps<typeof wrapperStyles>;
type LogoStylesProps = VariantProps<typeof logoStyles>;

interface IProps extends WrapperStylesProps, LogoStylesProps {
  // inverted?: boolean;
  showRippleAnimation?: boolean;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const WrappedLogo = (props: IProps) => {
  const { size, inverted, showRippleAnimation = false, className = "" } = props;

  return (
    <div className={wrapperStyles({ size, inverted })}>
      <Logo className={cn(logoStyles({ size }), className)} />

      {showRippleAnimation && <Ripple />}
    </div>
  );
};

export default WrappedLogo;
