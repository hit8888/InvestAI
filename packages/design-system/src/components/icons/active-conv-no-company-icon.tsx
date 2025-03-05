import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

// Default as it is in the Figma file

const ActiveConvNoCompanyIcon = ({ className = '', width, height, color, viewBox, ...props }: Props) => {
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
      <g filter="url(#filter0_i_8588_52128)">
        <circle cx="27" cy="26.998" r="27" fill={color} fillOpacity="0.5" />
      </g>
      <circle
        cx="27"
        cy="26.998"
        r="26.5179"
        stroke="url(#paint0_linear_8588_52128)"
        strokeOpacity="0.2"
        strokeWidth="0.964286"
      />
      <defs>
        <filter
          id="filter0_i_8588_52128"
          x="0"
          y="-0.00195312"
          width="54"
          height="61.7143"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="7.71429" />
          <feGaussianBlur stdDeviation="3.85714" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0" />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_8588_52128" />
        </filter>
        <linearGradient
          id="paint0_linear_8588_52128"
          x1="27"
          y1="-0.00195313"
          x2="27"
          y2="53.998"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D0D5DD" stopOpacity="0.7" />
          <stop offset="1" stopColor="#344054" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ActiveConvNoCompanyIcon;
