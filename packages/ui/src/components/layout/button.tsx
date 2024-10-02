import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../lib/cn";

const buttonVariants = cva(
  "ui-rounded-md ui-bg-primary ui-text-primary-foreground ui-font-medium ui-transition-all ui-duration-300 hover:ui-opacity-80 disabled:ui-pointer-events-none disabled:ui-cursor-not-allowed disabled:ui-opacity-50",
  {
    variants: {
      size: {
        sm: "ui-h-8 ui-px-3 ui-text-sm",
        md: "ui-h-10 ui-px-4 ui-text-base",
        lg: "ui-h-12 ui-px-6 ui-text-lg",
        icon: "ui-h-10 ui-w-10 ui-p-0 ui-flex ui-items-center ui-justify-center",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
