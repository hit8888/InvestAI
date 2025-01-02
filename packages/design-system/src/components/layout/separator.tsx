import React from 'react';
import { cn } from '../../lib/cn';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

const Separator = ({ className, ...props }: IProps) => {
  return <div className={cn('w-full border border-primary/10', className)} {...props}></div>;
};

export default Separator;
