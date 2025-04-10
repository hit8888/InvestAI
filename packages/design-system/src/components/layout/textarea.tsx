import { forwardRef, useImperativeHandle } from 'react';
import { cn } from '../../lib/cn';
import useAutoResizeTextArea from '../../hooks/useAutoResizeTextArea';

const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, parentRef) => {
    const { className, ...restProps } = props;
    const autoResizeRef = useAutoResizeTextArea({
      textAreaValue: props.value as string,
      initialHeight: 56,
      maxHeight: 100,
    });

    // Combine refs
    useImperativeHandle(parentRef, () => autoResizeRef.current!);

    return (
      <textarea
        ref={autoResizeRef}
        className={cn(
          'w-full flex-1 resize-none overflow-y-auto rounded-md border-gray-300 text-sm focus:border-gray-400 focus:ring-0 disabled:opacity-60',
          className,
        )}
        {...restProps}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
