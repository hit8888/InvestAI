import React from 'react';

interface SidebarToggleIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const SidebarToggleIcon: React.FC<SidebarToggleIconProps> = ({ width = 24, height = 24, className = '' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M11 6L11 18" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11L5 11" stroke="#98A2B3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8L5 8" stroke="#98A2B3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default SidebarToggleIcon;
