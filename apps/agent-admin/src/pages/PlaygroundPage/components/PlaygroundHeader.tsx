import React from 'react';
import { RotateCw, ChevronDown } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import DeviceSelector from './DeviceSelector';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';

interface PlaygroundHeaderProps {
  deviceType: 'desktop' | 'mobile';
  onDeviceTypeChange: (deviceType: 'desktop' | 'mobile') => void;
  onRefresh: () => void;
  showDeviceSelector?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isRefreshDisabled?: boolean;
}

const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  deviceType,
  onDeviceTypeChange,
  onRefresh,
  showDeviceSelector = true,
  isCollapsed,
  onToggleCollapse,
  isRefreshDisabled = false,
}) => {
  return (
    <div
      className={cn('relative flex items-center justify-between bg-gray-25 p-6', {
        'rounded-xl': isCollapsed,
        'border-b border-gray-100': !isCollapsed,
      })}
    >
      <div className="flex items-center gap-4">
        <Typography variant="title-18">Playground</Typography>
      </div>
      <div className="flex items-center gap-2">
        {showDeviceSelector && <DeviceSelector deviceType={deviceType} onDeviceTypeChange={onDeviceTypeChange} />}
        <TooltipWrapperDark
          showTooltip
          showArrow={false}
          content="Start a new session with existing configuration"
          trigger={
            <button
              id="playground-header-refresh-button"
              onClick={onRefresh}
              disabled={isRefreshDisabled}
              className={cn('flex h-8 items-center gap-2 rounded-lg bg-gray-100 px-2 py-1', {
                'cursor-not-allowed opacity-50': isRefreshDisabled,
              })}
            >
              <RotateCw className="h-4 w-4 text-gray-600" />
              <span className="text-sm capitalize">Refresh</span>
            </button>
          }
          tooltipSide="bottom"
          tooltipAlign="start"
        />
      </div>
      {/* Collapse button */}
      <button
        id="playground-header-collapse-button"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
      >
        <ChevronDown
          className={`h-3 w-3 text-gray-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>
    </div>
  );
};

export default PlaygroundHeader;
