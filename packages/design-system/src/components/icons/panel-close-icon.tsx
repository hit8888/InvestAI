import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const PanelCloseIcon = ({ className = 'text-primary', width, height, color, viewBox, ...props }: Props) => {
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
      <path
        d="M11 11.1667V5.83333L8.33333 8.5L11 11.1667ZM3.33333 14.5C2.96667 14.5 2.65278 14.3694 2.39167 14.1083C2.13056 13.8472 2 13.5333 2 13.1667V3.83333C2 3.46667 2.13056 3.15278 2.39167 2.89167C2.65278 2.63056 2.96667 2.5 3.33333 2.5H12.6667C13.0333 2.5 13.3472 2.63056 13.6083 2.89167C13.8694 3.15278 14 3.46667 14 3.83333V13.1667C14 13.5333 13.8694 13.8472 13.6083 14.1083C13.3472 14.3694 13.0333 14.5 12.6667 14.5H3.33333ZM5.33333 13.1667V3.83333H3.33333V13.1667H5.33333ZM6.66667 13.1667H12.6667V3.83333H6.66667V13.1667Z"
        fill={color}
      />
    </svg>
  );
};

export default PanelCloseIcon;
