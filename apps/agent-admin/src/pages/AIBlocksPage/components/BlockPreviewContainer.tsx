import SourcesDragDropPattern from '@breakout/design-system/components/icons/sources-dragdrop-patterns';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import React from 'react';

interface BlockPreviewContainerProps {
  children: React.ReactNode;
  className?: string;
  outerClassname?: string;
}

const BlockPreviewContainer = ({ children, className, outerClassname }: BlockPreviewContainerProps) => {
  return (
    <div className="sticky top-[72px] z-0 flex flex-1 flex-col items-start gap-4 bg-white">
      <div
        className={cn('relative min-h-[700px] w-full rounded-2xl border border-gray-200 bg-gray-25', outerClassname)}
      >
        <SourcesDragDropPattern />
        <Typography variant="title-18" className="absolute left-4 top-4 z-10">
          Block Preview
        </Typography>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'min-h-[500px] min-w-[80%] rounded-[20px] border border-gray-300 bg-[#F6F7F8] shadow-[0_0_24px_0_rgba(0,0,0,0.24)]',
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockPreviewContainer;
