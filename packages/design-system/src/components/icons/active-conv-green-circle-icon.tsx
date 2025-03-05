import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ActiveConvStatusCircleIcon = ({ className = '', width, height, color, viewBox, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      {...props}
    >
      <circle cx="4" cy="4" r="4" fill={color} />
    </svg>
  );
};

export default ActiveConvStatusCircleIcon;
