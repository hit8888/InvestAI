import { cn } from '../../lib/cn';
import React from 'react';
import sourcesDragDropPattern from '../../../assets/full-dot-pattern.svg';

type Props = React.SVGProps<SVGSVGElement>;

const SourcesDragDropPattern = ({ className = '' }: Props) => {
  return (
    <img
      src={sourcesDragDropPattern}
      alt="sources-dragdrop-pattern"
      className={cn('absolute h-full w-full object-cover', className)}
    />
  );
};

export default SourcesDragDropPattern;
