import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ArcCircleHeadIcon = ({ className = '', width, height, viewBox, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width || 4}
      height={height || 4}
      viewBox={viewBox || '0 0 4 4'}
      fill="none"
      {...props}
    >
      <circle cx="2" cy="2" r="2" fill="#D0D5DD" />
    </svg>
  );
};

export default ArcCircleHeadIcon;
