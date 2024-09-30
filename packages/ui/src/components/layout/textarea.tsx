import { forwardRef } from "react";
import { cn } from "../../lib/cn";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const { className, ...restProps } = props;

    return (
      <textarea
        ref={ref}
        className={cn(
          "ui-h-10 ui-w-full ui-flex-1 ui-resize-none ui-overflow-y-auto ui-rounded-md ui-border-gray-300 ui-text-sm focus:ui-border-primary focus:ui-ring-primary",
          className,
        )}
        {...restProps}
      />
    );
  },
);

TextArea.displayName = "TextArea";

export default TextArea;
