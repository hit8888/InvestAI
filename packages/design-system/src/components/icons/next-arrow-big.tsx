import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const NextArrowBig = ({ className = 'text-primary', width, height, color, ...props }: Props) => {
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
        d="M14.4746 12L7.12462 4.65C6.87462 4.4 6.75379 4.10417 6.76212 3.7625C6.77046 3.42083 6.89962 3.125 7.14962 2.875C7.39962 2.625 7.69546 2.5 8.03712 2.5C8.37879 2.5 8.67462 2.625 8.92462 2.875L16.5996 10.575C16.7996 10.775 16.9496 11 17.0496 11.25C17.1496 11.5 17.1996 11.75 17.1996 12C17.1996 12.25 17.1496 12.5 17.0496 12.75C16.9496 13 16.7996 13.225 16.5996 13.425L8.89962 21.125C8.64962 21.375 8.35796 21.4958 8.02462 21.4875C7.69129 21.4792 7.39962 21.35 7.14962 21.1C6.89962 20.85 6.77462 20.5542 6.77462 20.2125C6.77462 19.8708 6.89962 19.575 7.14962 19.325L14.4746 12Z"
        fill={color}
      />
    </svg>
  );
};

export default NextArrowBig;
