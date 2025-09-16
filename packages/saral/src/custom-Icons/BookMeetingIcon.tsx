import React from 'react';
type Props = React.SVGProps<SVGSVGElement>;

const BookMeetingIcon = ({ ...props }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none" {...props}>
      <circle cx="8" cy="5.5" r="4" stroke="#272A2E" strokeWidth="2" />
      <ellipse cx="8" cy="16.5" rx="7" ry="4" stroke="#272A2E" strokeWidth="2" />
      <path
        d="M17 1.5C17 1.5 19 2.7 19 5.5C19 8.3 17 9.5 17 9.5"
        stroke="#272A2E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 3.5C15 3.5 16 4.1 16 5.5C16 6.9 15 7.5 15 7.5"
        stroke="#272A2E"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default BookMeetingIcon;
