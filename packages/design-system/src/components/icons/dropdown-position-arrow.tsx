import React from 'react';
import { cn } from '../../lib/cn';

type Props = React.SVGProps<SVGSVGElement>;

const DropdownPositionArrowIcon = ({ className = '' }: Props) => {
  return (
    <svg className={cn('', className)} xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18">
      <path
        d="M1 10.7321C-0.333333 9.96225 -0.333333 8.03775 1 7.26795L13 0.339746C14.3333 -0.430054 16 0.532197 16 2.0718L16 15.9282C16 17.4678 14.3333 18.4301 13 17.6603L1 10.7321Z"
        fill="white"
      />
    </svg>
  );
};

export default DropdownPositionArrowIcon;
