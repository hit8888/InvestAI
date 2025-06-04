import { forwardRef, useEffect, useRef, CSSProperties } from 'react';
import { cn } from '../../lib/cn';

interface UseTextareaResizeProps {
  value?: string | number | readonly string[];
  maxHeight?: number;
  minHeight?: number;
}

const useTextareaResize = ({ value, maxHeight = 300, minHeight = 40 }: UseTextareaResizeProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Set the height to scrollHeight to fit content
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = 'auto';
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return {
    textareaRef,
    style: {
      minHeight: `${minHeight}px`,
      overflowY: 'auto' as const,
    } satisfies CSSProperties,
  };
};

interface ResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
}

const ResizeTextarea = forwardRef<HTMLTextAreaElement, ResizeTextareaProps>((props) => {
  const { className, value, minHeight, ...restProps } = props;
  const { textareaRef, style } = useTextareaResize({ value, minHeight });

  return (
    <textarea
      ref={textareaRef}
      className={cn('w-full overflow-y-auto rounded-xl border-gray-300 text-sm disabled:opacity-60', className)}
      style={style}
      value={value}
      {...restProps}
    />
  );
});

ResizeTextarea.displayName = 'ResizeTextarea';

export default ResizeTextarea;
