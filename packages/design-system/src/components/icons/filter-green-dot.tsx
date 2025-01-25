import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const FilterGreenDotIcon = ({ className = '',color, width="8", height="8", viewBox="0 0 8 8", ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      viewBox={viewBox}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <circle cx="4" cy="4" r="4" fill={color}/>
    </svg>
  );
};

export default FilterGreenDotIcon;
