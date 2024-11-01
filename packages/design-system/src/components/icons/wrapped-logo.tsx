import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import Ripple from "../animation/ripple";
import Logo from "./logo";

const wrapperStyles = cva("relative rounded-full", {
  variants: {
    size: {
      sm: "p-2",
      lg: "p-5",
    },
    inverted: {
      true: "bg-primary-foreground text-primary",
      false: "bg-primary text-primary-foreground",
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
      sm: "h-6 w-6",
      lg: "!h-14 !w-14",
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
