import React from 'react';

interface Avatar19Props {
  size?: number;
  className?: string;
}

export const Avatar19: React.FC<Avatar19Props> = ({ size = 50, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <g filter="url(#filter0_d_786_2593)">
        <rect x="5" y="5" width="50" height="50" rx="25" fill="#FFDCB9" />
        <rect x="5" y="5" width="50" height="50" rx="25" fill="url(#pattern0_786_2593)" />
        <rect
          x="5.4884"
          y="5.4884"
          width="49.0232"
          height="49.0232"
          rx="24.5116"
          stroke="white"
          stroke-width="0.976801"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_786_2593"
          x="0.238095"
          y="0.238095"
          width="59.5238"
          height="59.5238"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.38095" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_786_2593" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_786_2593" result="shape" />
        </filter>
        <pattern id="pattern0_786_2593" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_786_2593" transform="translate(-0.00251256) scale(0.00502513)" />
        </pattern>
        <image
          id="image0_786_2593"
          width="200"
          height="199"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};
