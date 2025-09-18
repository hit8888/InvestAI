import { cn } from '../../lib/cn';
import React from 'react';
import { FileUser } from 'lucide-react';

const FilterDocumentAccessTypeIcon = ({ className = '', width, height }: React.SVGProps<SVGSVGElement>) => {
  return <FileUser className={cn('', className)} width={width} height={height} />;
};

export default FilterDocumentAccessTypeIcon;
