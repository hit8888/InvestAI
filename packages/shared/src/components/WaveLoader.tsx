import { cn } from '@meaku/saral';

export const WaveLoader = ({ className = 'bg-foreground' }: { className?: string }) => (
  <div className="flex items-center justify-center space-x-1">
    <div
      className={cn('size-1.5 rounded-full', className)}
      style={{
        animationDelay: '0.2s',
        animationDuration: '0.7s',
        animationIterationCount: 'infinite',
        animationName: 'highBounce',
        animationTimingFunction: 'ease-in-out',
      }}
    />
    <div
      className={cn('size-1.5 rounded-full', className)}
      style={{
        animationDelay: '0.3s',
        animationDuration: '0.7s',
        animationIterationCount: 'infinite',
        animationName: 'highBounce',
        animationTimingFunction: 'ease-in-out',
      }}
    />
    <div
      className={cn('size-1.5 rounded-full', className)}
      style={{
        animationDelay: '0.4s',
        animationDuration: '0.7s',
        animationIterationCount: 'infinite',
        animationName: 'highBounce',
        animationTimingFunction: 'ease-in-out',
      }}
    />
  </div>
);
