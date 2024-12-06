import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <textarea
      ref={ref}
      className={cn(
        'h-10 w-full flex-1 resize-none overflow-y-auto rounded-md border-gray-300 text-sm focus:border-primary/40 disabled:opacity-60',
        className,
      )}
      {...restProps}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
