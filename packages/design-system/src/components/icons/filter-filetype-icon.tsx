import { cn } from '../../lib/cn';
import React from 'react';
import { FileType } from 'lucide-react';

const FilterFileTypeIcon = ({ className = '', width, height, color, ...props }: React.SVGProps<SVGSVGElement>) => {
  return <FileType className={cn('fill-current', className)} width={width} height={height} color={color} {...props} />;
};

export default FilterFileTypeIcon;
