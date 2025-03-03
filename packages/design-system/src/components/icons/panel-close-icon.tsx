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
        d="M8.25 8V4L6.25 6L8.25 8ZM2.5 10.5C2.225 10.5 1.98958 10.4021 1.79375 10.2063C1.59792 10.0104 1.5 9.775 1.5 9.5V2.5C1.5 2.225 1.59792 1.98958 1.79375 1.79375C1.98958 1.59792 2.225 1.5 2.5 1.5H9.5C9.775 1.5 10.0104 1.59792 10.2063 1.79375C10.4021 1.98958 10.5 2.225 10.5 2.5V9.5C10.5 9.775 10.4021 10.0104 10.2063 10.2063C10.0104 10.4021 9.775 10.5 9.5 10.5H2.5ZM4 9.5V2.5H2.5V9.5H4ZM5 9.5H9.5V2.5H5V9.5Z"
        fill={color}
      />
    </svg>
  );
};

export default PanelCloseIcon;
