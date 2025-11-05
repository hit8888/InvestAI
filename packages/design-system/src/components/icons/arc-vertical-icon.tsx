import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ArcVerticalIcon = ({ className = '', width, height, viewBox, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width || 17}
      height={height || 65}
      viewBox={viewBox || '0 0 17 65'}
      fill="none"
      {...props}
    >
      <path
        d="M0.5 0H16.5H0.5ZM16.5 64.5H8.5C3.80558 64.5 0 60.6944 0 56H1C1 60.1421 4.35786 63.5 8.5 63.5H16.5V64.5ZM8.5 64.5C3.80558 64.5 0 60.6944 0 56V0H1V56C1 60.1421 4.35786 63.5 8.5 63.5V64.5ZM16.5 0V64V0Z"
        fill="#D0D5DD"
      />
    </svg>
  );
};

export default ArcVerticalIcon;
