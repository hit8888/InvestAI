import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const DropdownIcon = ({ className = 'text-primary', width, height, color, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M11.4742 14.475L7.84922 10.85C7.79922 10.8 7.76172 10.7458 7.73672 10.6875C7.71172 10.6292 7.69922 10.5667 7.69922 10.5C7.69922 10.3667 7.74505 10.25 7.83672 10.15C7.92839 10.05 8.04922 10 8.19922 10H15.7992C15.9492 10 16.0701 10.05 16.1617 10.15C16.2534 10.25 16.2992 10.3667 16.2992 10.5C16.2992 10.5333 16.2492 10.65 16.1492 10.85L12.5242 14.475C12.4409 14.5583 12.3576 14.6167 12.2742 14.65C12.1909 14.6833 12.0992 14.7 11.9992 14.7C11.8992 14.7 11.8076 14.6833 11.7242 14.65C11.6409 14.6167 11.5576 14.5583 11.4742 14.475Z"
        fill={color}
      />
    </svg>
  );
};

export default DropdownIcon;
