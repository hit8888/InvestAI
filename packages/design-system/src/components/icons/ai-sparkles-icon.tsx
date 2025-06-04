import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const AiSparklesIcon = ({ className = '', width, height, viewBox, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox || '0 0 24 24'}
      fill="none"
      {...props}
    >
      <mask
        id="mask0_10882_396853"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="2"
        y="1"
        width="20"
        height="22"
      >
        <path
          d="M18.3431 14.1547C18.2352 14.1755 18.0351 14.2178 17.8337 14.2524C16.3435 14.5074 14.8622 14.7931 13.5709 15.6524C12.0464 16.6669 11.3637 18.2062 10.9747 19.9128C10.8258 20.5655 10.7343 21.2319 10.6334 21.8947C10.6054 22.0791 10.4908 21.9754 10.4156 21.9954C10.2513 22.0388 10.301 21.9061 10.2888 21.8275C10.0131 20.0568 9.72326 18.2925 8.58902 16.8124C7.63792 15.571 6.30146 14.9779 4.85039 14.6038C4.13407 14.4189 3.39354 14.3281 2.6633 14.1978C2.56562 14.1805 2.49193 14.2133 2.50071 14.0345C2.50885 13.8701 2.54805 13.8713 2.67272 13.8522C4.44061 13.5813 6.20078 13.289 7.67798 12.1526C8.91676 11.1995 9.50862 9.86019 9.88199 8.40608C10.0664 7.68825 10.157 6.94617 10.2871 6.21439C10.3044 6.11651 10.2719 6.04288 10.4501 6.05146C10.6144 6.05962 10.6129 6.0989 10.6319 6.22383C10.9025 7.99543 11.194 9.7593 12.3283 11.2396C13.2794 12.481 14.6156 13.075 16.0669 13.4478C16.7922 13.6341 17.542 13.7284 18.2827 13.8507C18.4316 13.875 18.4502 13.9257 18.3431 14.1547Z"
          fill="#4E46DC"
        />
        <path
          d="M20.9513 5.38288C20.9023 5.3923 20.8114 5.41158 20.7198 5.42729C20.0424 5.54323 19.3691 5.67317 18.7822 6.06369C18.0893 6.52475 17.7789 7.22455 17.602 8.00017C17.5343 8.29688 17.4927 8.59988 17.4468 8.90101C17.434 8.98483 17.382 8.93771 17.3478 8.9467C17.273 8.96641 17.2958 8.90616 17.2902 8.87032C17.165 8.06542 17.0332 7.26353 16.5176 6.59072C16.0853 6.02642 15.4779 5.75684 14.8183 5.58678C14.4927 5.50282 14.156 5.46141 13.8241 5.4023C13.7797 5.39445 13.7463 5.4093 13.7503 5.32805C13.754 5.25337 13.7718 5.25394 13.8286 5.24523C14.6321 5.12201 15.4323 4.98922 16.1037 4.47261C16.6668 4.0394 16.9358 3.43055 17.1055 2.76973C17.1893 2.44346 17.2306 2.10606 17.2896 1.77351C17.2976 1.72896 17.2827 1.69555 17.3637 1.69954C17.4384 1.70326 17.4377 1.7211 17.4464 1.77793C17.5693 2.58311 17.7019 3.385 18.2174 4.05782C18.6497 4.62211 19.2571 4.89212 19.9169 5.06161C20.2466 5.14628 20.5873 5.18912 20.9241 5.24481C20.9917 5.2558 21.0001 5.27879 20.9513 5.38288Z"
          fill="#4E46DC"
        />
        <path
          d="M21.2275 20.3149C21.1919 20.3217 21.1259 20.3357 21.0594 20.3471C20.5677 20.431 20.079 20.5251 19.6529 20.8077C19.1499 21.1415 18.9246 21.648 18.7962 22.2095C18.747 22.4243 18.7168 22.6436 18.6835 22.8616C18.6742 22.9223 18.6365 22.8882 18.6116 22.8947C18.5573 22.9089 18.5739 22.8653 18.5698 22.8394C18.4789 22.2567 18.3833 21.6763 18.009 21.1892C17.6952 20.7808 17.2543 20.5856 16.7755 20.4625C16.5391 20.4017 16.2947 20.3718 16.0538 20.329C16.0215 20.3233 15.9973 20.334 16.0002 20.2752C16.0029 20.2212 16.0159 20.2216 16.057 20.2153C16.6403 20.1261 17.2212 20.03 17.7086 19.656C18.1173 19.3424 18.3126 18.9017 18.4358 18.4233C18.4966 18.1872 18.5266 17.9429 18.5694 17.7022C18.5752 17.67 18.5644 17.6458 18.6232 17.6487C18.6774 17.6514 18.6769 17.6643 18.6832 17.7054C18.7725 18.2883 18.8687 18.8687 19.2429 19.3558C19.5567 19.7642 19.9977 19.9597 20.4766 20.0824C20.7159 20.1437 20.9632 20.1747 21.2077 20.215C21.2568 20.2229 21.2629 20.2396 21.2275 20.3149Z"
          fill="#4E46DC"
        />
      </mask>
      <g mask="url(#mask0_10882_396853)">
        <circle cx="12.25" cy="12.9492" r="13.5" fill="#4E46DC" />
        <g filter="url(#filter0_f_10882_396853)">
          <circle cx="5.5" cy="6.19922" r="7.5" fill="#A9A4FF" />
        </g>
        <g filter="url(#filter1_f_10882_396853)">
          <circle cx="19" cy="12.9492" r="7.5" fill="#DCADFC" />
        </g>
        <g filter="url(#filter2_f_10882_396853)">
          <circle cx="7.75" cy="21.9492" r="7.5" fill="#6FC8FC" />
        </g>
        <g filter="url(#filter3_f_10882_396853)">
          <rect x="2" y="1" width="20" height="22" fill="url(#shimmerGradient)" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_10882_396853"
          x="-14"
          y="-13.3008"
          width="39"
          height="39"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_10882_396853" />
        </filter>
        <filter
          id="filter1_f_10882_396853"
          x="-0.5"
          y="-6.55078"
          width="39"
          height="39"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_10882_396853" />
        </filter>
        <filter
          id="filter2_f_10882_396853"
          x="-11.75"
          y="2.44922"
          width="39"
          height="39"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_10882_396853" />
        </filter>
        <filter
          id="filter3_f_10882_396853"
          x="-5"
          y="-5"
          width="30"
          height="32"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_10882_396853" />
        </filter>
        <linearGradient id="shimmerGradient" gradientUnits="userSpaceOnUse" x1="0" y1="1" x2="0" y2="23">
          <stop offset="0%" style={{ stopColor: '#EDECFB', stopOpacity: 0 }} />
          <stop offset="30%" style={{ stopColor: '#EDECFB', stopOpacity: 0.5 }} />
          <stop offset="40%" style={{ stopColor: '#EDECFB', stopOpacity: 1 }} />
          <stop offset="60%" style={{ stopColor: '#EDECFB', stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: '#EDECFB', stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: '#EDECFB', stopOpacity: 0 }} />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="0 -16.5; 0 16.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default AiSparklesIcon;
