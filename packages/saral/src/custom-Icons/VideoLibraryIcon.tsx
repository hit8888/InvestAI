import { cn } from '../utils';
import React from 'react';
type Props = React.SVGProps<SVGSVGElement>;

const VideoLibraryIcon = ({ className = '', width, height, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-none stroke-current', className)}
      viewBox="0 0 18 18"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 0.25C10.6146 0.25 11.9131 0.25 12.9726 0.326851L9.96129 4.84377H5.85121L8.91373 0.25H9Z"
        strokeWidth="1"
      />
      <path
        d="M1.53141 1.53141C2.62723 0.435587 4.2942 0.276879 7.3337 0.253893L4.27379 4.84377H0.341157C0.47 3.30019 0.780952 2.28186 1.53141 1.53141Z"
        strokeWidth="1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.25 9C0.25 7.91785 0.25 6.97765 0.273139 6.15627H17.7269C17.75 6.97765 17.75 7.91785 17.75 9C17.75 13.1248 17.75 15.1872 16.4686 16.4686C15.1872 17.75 13.1248 17.75 9 17.75C4.87521 17.75 2.81282 17.75 1.53141 16.4686C0.25 15.1872 0.25 13.1248 0.25 9ZM9.88722 9.51206C11.0457 10.2596 11.625 10.6333 11.625 11.1875C11.625 11.7417 11.0457 12.1154 9.88723 12.8629C8.71289 13.6206 8.1257 13.9995 7.68785 13.7213C7.25 13.4432 7.25 12.6913 7.25 11.1875C7.25 9.68372 7.25 8.93183 7.68785 8.65366C8.1257 8.37549 8.71287 8.75435 9.88722 9.51206Z"
        strokeWidth="1"
      />
      <path
        d="M17.6588 4.84377C17.53 3.30019 17.219 2.28186 16.4686 1.53141C15.9459 1.00875 15.2933 0.699272 14.4239 0.516024L11.5387 4.84377H17.6588Z"
        strokeWidth="1"
      />
    </svg>
  );
};

export default VideoLibraryIcon;
