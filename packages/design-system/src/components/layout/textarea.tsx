import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <textarea
      ref={ref}
      className={cn(
        'focus:border-primary-400 h-10 w-full flex-1 resize-none overflow-y-auto rounded-md border-gray-300 text-sm disabled:opacity-60',
        className,
      )}
      {...restProps}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
