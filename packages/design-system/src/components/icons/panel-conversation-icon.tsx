import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const PanelConversationIcon = ({ className = 'text-primary', width, height, color, viewBox, ...props }: Props) => {
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
        d="M14.667 14.667L12 12H5.333C4.967 12 4.653 11.87 4.392 11.608C4.13 11.347 4 11.033 4 10.667V10H11.333C11.7 10 12.014 9.87 12.275 9.608C12.537 9.347 12.667 9.033 12.667 8.667V4H13.333C13.7 4 14.014 4.13 14.275 4.392C14.537 4.653 14.667 4.967 14.667 5.333V14.667ZM2.667 8.117L3.783 7H10V2.667H2.667V8.117ZM1.333 11.333V2.667C1.333 2.3 1.463 1.987 1.725 1.725C1.987 1.463 2.3 1.333 2.667 1.333H10C10.367 1.333 10.681 1.463 10.942 1.725C11.204 1.987 11.333 2.3 11.333 2.667V7.333C11.333 7.7 11.204 8.014 10.942 8.275C10.681 8.537 10.367 8.667 10 8.667H4L1.333 11.333Z"
        fill={color}
      />
    </svg>
  );
};

export default PanelConversationIcon;
