import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const PreviousArrowBig = ({ className = 'text-primary', width, height, color, ...props }: Props) => {
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
        d="M9.5502 11.9996L16.9002 19.3496C17.1502 19.5996 17.271 19.8913 17.2627 20.2246C17.2544 20.558 17.1252 20.8496 16.8752 21.0996C16.6252 21.3496 16.3335 21.4746 16.0002 21.4746C15.6669 21.4746 15.3752 21.3496 15.1252 21.0996L7.4252 13.4246C7.2252 13.2246 7.0752 12.9996 6.9752 12.7496C6.8752 12.4996 6.8252 12.2496 6.8252 11.9996C6.8252 11.7496 6.8752 11.4996 6.9752 11.2496C7.0752 10.9996 7.2252 10.7746 7.4252 10.5746L15.1252 2.87462C15.3752 2.62462 15.671 2.50379 16.0127 2.51212C16.3544 2.52046 16.6502 2.64962 16.9002 2.89962C17.1502 3.14962 17.2752 3.44129 17.2752 3.77462C17.2752 4.10796 17.1502 4.39962 16.9002 4.64962L9.5502 11.9996Z"
        fill={color}
      />
    </svg>
  );
};

export default PreviousArrowBig;
