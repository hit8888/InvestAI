import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../lib/cn";

const botIndicatorVariants = cva("", {
  variants: {
    size: {
      base: "h-5 w-5",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

interface IProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof botIndicatorVariants> {}

const BotIndicator = React.forwardRef<HTMLDivElement, IProps>(
  ({ className, size, ...props }) => {
    return (
      <div className={cn("relative h-5 w-5", botIndicatorVariants({ size }))}>
        <div
          className={cn(
            "bot-indicator absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 scale-150 transform rounded-full opacity-60 blur-lg",
            botIndicatorVariants({ size }),
          )}
        ></div>
        <div
          className={cn(
            "bot-indicator h-5 w-5 rounded-full",
            botIndicatorVariants({ size }),
          )}
          {...props}
        ></div>
      </div>
    );
  },
);

export default BotIndicator;
