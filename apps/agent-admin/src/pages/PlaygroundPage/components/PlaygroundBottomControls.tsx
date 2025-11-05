import React from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';

interface PlaygroundBottomControlsProps {
  onPreviewAgent: () => void;
  onExternalPreview: () => void;
  onClearAll: () => void;
  isPreviewDisabled: boolean;
  isClearAllDisabled: boolean;
}

const PlaygroundBottomControls: React.FC<PlaygroundBottomControlsProps> = ({
  onPreviewAgent,
  onExternalPreview,
  onClearAll,
  isPreviewDisabled,
  isClearAllDisabled,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-gray-25 p-4 shadow-[0px_0px_1.56px_0px_rgba(0,0,0,0.01),0px_0px_2.95px_0px_rgba(0,0,0,0.02),0px_0px_4.93px_0px_rgba(0,0,0,0.02),0px_0px_8.29px_0px_rgba(0,0,0,0.03),0px_0px_13.8px_0px_rgba(0,0,0,0.03),0px_0px_22.23px_0px_rgba(0,0,0,0.03),0px_0px_34.38px_0px_rgba(0,0,0,0.04),0px_0px_51px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={onClearAll}
        disabled={isClearAllDisabled}
        className="cursor-pointer underline hover:no-underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
      >
        <Typography variant="caption-12-medium">Clear All</Typography>
      </button>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onExternalPreview}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-gray-900 bg-white transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ExternalLink className="h-4 w-4 text-gray-600" />
        </button>
        <Button
          type="button"
          variant="system"
          size="small"
          className="flex items-center gap-2 border-0 bg-gray-900 text-white hover:bg-gray-800"
          onClick={onPreviewAgent}
          disabled={isPreviewDisabled}
        >
          Preview
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundBottomControls;
