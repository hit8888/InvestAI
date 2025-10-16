import { useEffect, useRef, forwardRef } from 'react';
import { cn } from './utils';

const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, style, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const height = Number(style?.height) || 56;
    const maxHeight = Number(style?.maxHeight) || 150;

    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (!textarea.value.trim()) {
        textarea.style.height = `${height}px`;
        return;
      }

      if (textarea.scrollHeight > textarea.clientHeight) {
        const contentHeight = textarea.scrollHeight;
        textarea.style.height = `${Math.min(contentHeight, Number(maxHeight))}px`;
      }

      textarea.scrollTop = textarea.scrollHeight;
    }, [props.value, height, maxHeight]);

    return (
      <textarea
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          textareaRef.current = node;
        }}
        className={cn(
          'flex w-full resize-none overflow-y-auto rounded-md bg-background px-3 py-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export { TextArea };
