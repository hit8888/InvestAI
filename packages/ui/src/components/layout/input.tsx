import React from "react";
import { cn } from "../../lib/cn";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const { className, ...restProps } = props;

  return (
    <input
      className={cn(
        "ui-h-10 ui-w-full ui-flex-1 ui-resize-none ui-overflow-y-auto ui-rounded-md ui-border-gray-300 ui-text-sm focus:ui-border-primary focus:ui-ring-primary",
        className,
      )}
      {...restProps}
    />
  );
};

export default Input;
