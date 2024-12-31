import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ConversationsIcon = ({ className = 'text-primary', width, height, color, viewBox, ...props }: Props) => {
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
        d="M7 18.5C6.71667 18.5 6.47917 18.4042 6.2875 18.2125C6.09583 18.0208 6 17.7833 6 17.5V15.5H19V6.5H21C21.2833 6.5 21.5208 6.59583 21.7125 6.7875C21.9042 6.97917 22 7.21667 22 7.5V22.5L18 18.5H7ZM2 17.5V3.5C2 3.21667 2.09583 2.97917 2.2875 2.7875C2.47917 2.59583 2.71667 2.5 3 2.5H16C16.2833 2.5 16.5208 2.59583 16.7125 2.7875C16.9042 2.97917 17 3.21667 17 3.5V12.5C17 12.7833 16.9042 13.0208 16.7125 13.2125C16.5208 13.4042 16.2833 13.5 16 13.5H6L2 17.5Z"
        fill={color}
      />
    </svg>
  );
};

export default ConversationsIcon;
