import { cn } from '../../lib/cn';
import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const FilterCompanyIcon = ({ className = '', width, height, color, viewBox, ...props }: Props) => {
  return (
    <svg
      className={cn('fill-current', className)}
      viewBox={viewBox}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.99951 21C3.44951 21 2.97868 20.8042 2.58701 20.4125C2.19535 20.0208 1.99951 19.55 1.99951 19V8C1.99951 7.45 2.19535 6.97917 2.58701 6.5875C2.97868 6.19583 3.44951 6 3.99951 6H7.99951V4C7.99951 3.45 8.19535 2.97917 8.58701 2.5875C8.97868 2.19583 9.44951 2 9.99951 2H13.9995C14.5495 2 15.0203 2.19583 15.412 2.5875C15.8037 2.97917 15.9995 3.45 15.9995 4V6H19.9995C20.5495 6 21.0203 6.19583 21.412 6.5875C21.8037 6.97917 21.9995 7.45 21.9995 8V19C21.9995 19.55 21.8037 20.0208 21.412 20.4125C21.0203 20.8042 20.5495 21 19.9995 21H3.99951ZM3.99951 19H19.9995V8H3.99951V19ZM9.99951 6H13.9995V4H9.99951V6Z"
        fill={color}
      />
    </svg>
  );
};

export default FilterCompanyIcon;
