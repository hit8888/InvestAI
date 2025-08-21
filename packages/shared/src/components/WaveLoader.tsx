import { cn } from '@meaku/saral';

export const WaveLoader = ({ className = 'bg-foreground' }: { className?: string }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {['200ms', '300ms', '400ms'].map((delay) => (
        <div
          key={delay}
          className={cn(
            'size-1.5 rounded-full animate-high-bounce duration-700 [animation-delay:' + delay + ']',
            className,
          )}
        />
      ))}
    </div>
  );
};
