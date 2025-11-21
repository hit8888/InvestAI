import React from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { RefreshCw } from 'lucide-react';
import RefreshChatIcon from '@breakout/design-system/components/icons/refresh';
import { cn } from '@breakout/design-system/lib/cn';

interface SettingsPanelControlsProps {
  onRefresh: () => void;
  onPreviewAgent: () => void;
  isPreviewDisabled: boolean;
  isRefreshDisabled: boolean;
}

const SettingsPanelControls: React.FC<SettingsPanelControlsProps> = ({
  onRefresh,
  onPreviewAgent,
  isPreviewDisabled,
  isRefreshDisabled,
}) => {
  return (
    <div className="border-t border-gray-200 bg-gray-25 p-4 shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <Button
          id="playground-refresh-button"
          type="button"
          variant="system_secondary"
          size="small"
          className="gap-2"
          onClick={onRefresh}
          disabled={isRefreshDisabled}
        >
          Refresh
          <RefreshChatIcon className="h-4 w-4" />
        </Button>
        <Button
          id="playground-preview-agent-button"
          type="button"
          variant="primary"
          size="small"
          className={cn('gap-2', {
            '!bg-black/50': isPreviewDisabled,
            '!bg-black': !isPreviewDisabled,
          })}
          onClick={onPreviewAgent}
          disabled={isPreviewDisabled}
        >
          Preview Agent
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanelControls;
