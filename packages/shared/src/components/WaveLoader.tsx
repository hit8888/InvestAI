import { cn } from '@meaku/saral';

export const WaveLoader = ({ className = 'bg-foreground' }: { className?: string }) => (
  <div className="flex items-center justify-center space-x-1">
    <div className={cn('size-1.5 rounded-full animate-high-bounce duration-700 [animation-delay:200ms]', className)} />
    <div className={cn('size-1.5 rounded-full animate-high-bounce duration-700 [animation-delay:300ms]', className)} />
    <div className={cn('size-1.5 rounded-full animate-high-bounce duration-700 [animation-delay:400ms]', className)} />
  </div>
);
