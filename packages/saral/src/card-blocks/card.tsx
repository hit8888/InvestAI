import * as React from 'react';
import { cn } from '../utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-xl border bg-primary/20 text-gray-950 shadow', className)} {...props} />
));
Card.displayName = 'Card';

export default Card;
