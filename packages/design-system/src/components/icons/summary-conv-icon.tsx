import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const SummaryOfTheConversationIcon = ({ className = '', width, height, color, viewBox, ...props }: Props) => {
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
      <path
        d="M2.66659 14.0002C2.29992 14.0002 1.98603 13.8696 1.72492 13.6085C1.46381 13.3474 1.33325 13.0335 1.33325 12.6668V5.3335C1.33325 4.96683 1.46381 4.65294 1.72492 4.39183C1.98603 4.13072 2.29992 4.00016 2.66659 4.00016H5.33325V2.66683C5.33325 2.30016 5.46381 1.98627 5.72492 1.72516C5.98603 1.46405 6.29992 1.3335 6.66658 1.3335H9.33325C9.69992 1.3335 10.0138 1.46405 10.2749 1.72516C10.536 1.98627 10.6666 2.30016 10.6666 2.66683V4.00016H13.3333C13.6999 4.00016 14.0138 4.13072 14.2749 4.39183C14.536 4.65294 14.6666 4.96683 14.6666 5.3335V12.6668C14.6666 13.0335 14.536 13.3474 14.2749 13.6085C14.0138 13.8696 13.6999 14.0002 13.3333 14.0002H2.66659ZM2.66659 12.6668H13.3333V5.3335H2.66659V12.6668ZM6.66658 4.00016H9.33325V2.66683H6.66658V4.00016Z"
        fill={color}
      />
    </svg>
  );
};

export default SummaryOfTheConversationIcon;
