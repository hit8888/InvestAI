import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ArcArrowHeadIcon = ({ className = '', width, height, viewBox, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width || 7}
      height={height || 6}
      viewBox={viewBox || '0 0 7 6'}
      fill="none"
      {...props}
    >
      <path
        d="M2.6666 0.25C2.85905 -0.0833337 3.34017 -0.0833333 3.53262 0.25L6.1307 4.75C6.32315 5.08333 6.08259 5.5 5.69769 5.5H0.501533C0.116633 5.5 -0.12393 5.08333 0.0685205 4.75L2.6666 0.25Z"
        fill="#D0D5DD"
      />
    </svg>
  );
};

export default ArcArrowHeadIcon;
