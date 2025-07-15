import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ArrowUpIcon = ({ className = '', width = 8, height = 38, ...props }: Props) => {
  return (
    <svg
      className={cn(className)}
      width={width}
      height={height}
      viewBox="0 0 8 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.35355 0.646447C4.15829 0.451184 3.84171 0.451184 3.64645 0.646447L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646447ZM3.5 30C3.5 30.2761 3.72386 30.5 4 30.5C4.27614 30.5 4.5 30.2761 4.5 30L3.5 30ZM4 1L3.5 1L3.5 30L4 30L4.5 30L4.5 1L4 1Z"
        fill="#98A2B3"
      />
      <rect x="1.25" y="32.25" width="5.5" height="5.5" rx="2.75" stroke="#98A2B3" stroke-width="0.5" />
      <circle cx="4" cy="35" r="1" fill="#98A2B3" />
    </svg>
  );
};

export default ArrowUpIcon;
