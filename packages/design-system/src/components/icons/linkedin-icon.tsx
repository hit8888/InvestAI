import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const LinkedInIcon = ({
  className = 'text-primary',
  width = 16,
  height = 16,
  color,
  viewBox = '0 0 16 16',
  ...props
}: Props) => {
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
      <circle cx="3.558" cy="3.578" r="1.378" fill={color} />
      <path d="M2.37 6H4.746V13.635H2.37V6Z" fill={color} />
      <path
        d="M6.18 6H8.456V7.041H8.486C8.797 6.441 9.632 5.799 10.873 5.799C13.274 5.799 13.633 7.387 13.633 9.444V13.635H11.266V9.922C11.266 9.027 11.249 7.896 10.0 7.896C8.732 7.896 8.546 8.851 8.546 9.857V13.635H6.18V6Z"
        fill={color}
      />
    </svg>
  );
};

export default LinkedInIcon;
