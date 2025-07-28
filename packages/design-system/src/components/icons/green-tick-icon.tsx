import { cn } from '../../lib/cn';
import React from 'react';
type Props = React.SVGProps<SVGSVGElement>;

const GreenTickIcon = ({ className = '', width, height, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      viewBox="0 0 50 50"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25 50C38.531 50 49.5 38.8071 49.5 25C49.5 11.1929 38.531 0 25 0C11.469 0 0.5 11.1929 0.5 25C0.5 38.8071 11.469 50 25 50ZM35.0053 21.4929C36.114 20.4568 36.1896 18.6997 35.1742 17.5683C34.1587 16.437 32.4368 16.3598 31.3281 17.396L21.2774 26.7888L18.6719 24.3538C17.5632 23.3177 15.8413 23.3949 14.8258 24.5262C13.8104 25.6575 13.886 27.4146 14.9947 28.4508L19.4388 32.604C20.4793 33.5764 22.0755 33.5764 23.116 32.604L35.0053 21.4929Z"
        fill="#3FC95C"
      />
    </svg>
  );
};

export default GreenTickIcon;
