import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const PanelNavArrowLiningIcon = ({ className = 'text-primary', width, height, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 56 44"
      fill="none"
      {...props}
    >
      <path
        d="M36 0H54H36ZM54 23H44C39.0294 23 35 18.9706 35 14H37C37 17.866 40.134 21 44 21H54V23ZM44 23C39.0294 23 35 18.9706 35 14V0H37V14C37 17.866 40.134 21 44 21V23ZM54 0V22V0Z"
        fill="#D0D5DD"
      />
      <path d="M36 44H37V7H36H35V44H36Z" fill="#D0D5DD" />
    </svg>
  );
};

export default PanelNavArrowLiningIcon;
