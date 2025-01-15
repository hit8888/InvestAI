import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const CompanyNameIcon = ({ className = 'text-primary', width, height, color, viewBox, ...props }: Props) => {
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
        d="M2.66683 13.9997C2.30016 13.9997 1.98627 13.8691 1.72516 13.608C1.46405 13.3469 1.3335 13.033 1.3335 12.6663V5.33301C1.3335 4.96634 1.46405 4.65245 1.72516 4.39134C1.98627 4.13023 2.30016 3.99967 2.66683 3.99967H5.3335V2.66634C5.3335 2.29967 5.46405 1.98579 5.72516 1.72467C5.98627 1.46356 6.30016 1.33301 6.66683 1.33301H9.3335C9.70016 1.33301 10.0141 1.46356 10.2752 1.72467C10.5363 1.98579 10.6668 2.29967 10.6668 2.66634V3.99967H13.3335C13.7002 3.99967 14.0141 4.13023 14.2752 4.39134C14.5363 4.65245 14.6668 4.96634 14.6668 5.33301V12.6663C14.6668 13.033 14.5363 13.3469 14.2752 13.608C14.0141 13.8691 13.7002 13.9997 13.3335 13.9997H2.66683ZM2.66683 12.6663H13.3335V5.33301H2.66683V12.6663ZM6.66683 3.99967H9.3335V2.66634H6.66683V3.99967Z"
        fill={color}
      />
    </svg>
  );
};

export default CompanyNameIcon;
