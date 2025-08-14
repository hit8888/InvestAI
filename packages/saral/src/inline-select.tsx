'use client';

import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from './utils';

interface InlineSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

interface InlineSelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface InlineSelectContentProps {
  className?: string;
  children: React.ReactNode;
}

interface InlineSelectItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const InlineSelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const InlineSelect = ({ value, onValueChange, className, children }: InlineSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handling for outside click, closing the dropdown option container
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const eventTarget = event.target as Node | null;
      if (!containerRef.current || !eventTarget) return;
      const clickedOutside = !containerRef.current.contains(eventTarget);
      if (clickedOutside) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <InlineSelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div ref={containerRef} className={cn('relative', className)}>
        {children}
      </div>
    </InlineSelectContext.Provider>
  );
};

export const InlineSelectTrigger = React.forwardRef<HTMLButtonElement, InlineSelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(InlineSelectContext);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1',
          'border-gray-300 bg-white',
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')} />
      </button>
    );
  },
);
InlineSelectTrigger.displayName = 'InlineSelectTrigger';

export const InlineSelectValue = ({ placeholder }: { placeholder?: string }) => {
  const { value } = React.useContext(InlineSelectContext);

  return <span className={cn(!value && 'text-muted-foreground')}>{value || placeholder}</span>;
};

export const InlineSelectContent = React.forwardRef<HTMLDivElement, InlineSelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen } = React.useContext(InlineSelectContext);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-md',
          'border-gray-300',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
InlineSelectContent.displayName = 'InlineSelectContent';

export const InlineSelectItem = React.forwardRef<HTMLDivElement, InlineSelectItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(InlineSelectContext);
    const isSelected = selectedValue === value;

    const handleClick = () => {
      onValueChange?.(value);
      setIsOpen(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
          'h-10',
          isSelected && 'bg-accent text-accent-foreground',
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    );
  },
);
InlineSelectItem.displayName = 'InlineSelectItem';
