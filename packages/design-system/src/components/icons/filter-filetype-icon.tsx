import { cn } from '../../lib/cn';
import React from 'react';
import { FileType } from 'lucide-react';

const FilterFileTypeIcon = ({ className = '', width, height }: React.SVGProps<SVGSVGElement>) => {
  return <FileType className={cn('', className)} width={width} height={height} />;
};

export default FilterFileTypeIcon;
