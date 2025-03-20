import { cn } from '../../lib/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-lg bg-primary/10 opacity-50', className)} {...props} />;
}

export { Skeleton };
