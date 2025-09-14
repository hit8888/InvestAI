import { Typography } from '@meaku/saral';
import { ReactNode } from 'react';
import { BaseArtifactProps } from '../types/artifact.types';

interface BaseArtifactComponentProps extends BaseArtifactProps {
  children?: ReactNode;
  expandedContent: ReactNode;
  headerActions?: ReactNode;
}

/**
 * Base component for artifacts (images, videos) that handles common layout and expanded mode
 */
export const BaseArtifact = ({
  title,
  isExpanded = false,
  children,
  expandedContent,
  headerActions,
}: BaseArtifactComponentProps) => {
  // When expanded, render content inline without sidebar functionality
  if (isExpanded) {
    return (
      <div className="w-full">
        <div className="flex flex-col border rounded-xl overflow-hidden w-full">
          <div className="flex items-center gap-2 w-full bg-primary/10 p-2 py-3 flex-shrink-0">
            <Typography variant="body" fontWeight="medium" className="truncate flex-1 mr-2">
              {title}
            </Typography>
          </div>
          <div className="w-full overflow-hidden">{expandedContent}</div>
        </div>
      </div>
    );
  }

  // Regular mode with sidebar functionality
  return (
    <div className="w-full">
      <div className="flex justify-end group flex-col border rounded-xl overflow-hidden relative">
        <div className="p-3 bg-primary/10 flex items-center justify-between">
          <Typography variant="body-small" fontWeight="medium" className="max-w-72">
            {title}
          </Typography>
          {headerActions}
        </div>
        {children}
      </div>
    </div>
  );
};

export type { BaseArtifactComponentProps };
