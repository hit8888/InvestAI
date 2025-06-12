import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const UserInputEnrichmentIcon = ({ className = '', width = 26, height = 26, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      width={width}
      height={height}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="26" height="26" rx="8" fill="#D0F1E1" />
      <path
        d="M12.9707 17.1406C12.2832 17.1406 11.6816 17.0059 11.166 16.7363C10.6543 16.4668 10.2578 16.0977 9.97656 15.6289C9.69531 15.1602 9.55469 14.627 9.55469 14.0293V8.26953H10.668V13.9414C10.668 14.3594 10.7598 14.7324 10.9434 15.0605C11.1309 15.3848 11.3965 15.6406 11.7402 15.8281C12.084 16.0156 12.4941 16.1094 12.9707 16.1094C13.4473 16.1094 13.8555 16.0156 14.1953 15.8281C14.5391 15.6406 14.8027 15.3848 14.9863 15.0605C15.1699 14.7324 15.2617 14.3594 15.2617 13.9414V8.26953H16.375V14.0293C16.375 14.627 16.2344 15.1602 15.9531 15.6289C15.6719 16.0977 15.2754 16.4668 14.7637 16.7363C14.2559 17.0059 13.6582 17.1406 12.9707 17.1406Z"
        fill="#4E5BA6"
      />
    </svg>
  );
};

export default UserInputEnrichmentIcon;
