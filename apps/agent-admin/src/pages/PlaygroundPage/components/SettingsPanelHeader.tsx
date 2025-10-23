import React from 'react';
import Typography from '@breakout/design-system/components/Typography/index';
import PanelCloseIcon from '@breakout/design-system/components/icons/panel-close-icon';
import { ExternalLink } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';

interface SettingsPanelHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onExternalPreview: () => void;
}

const SettingsPanelHeader: React.FC<SettingsPanelHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onExternalPreview,
}) => {
  return (
    <div
      className={cn('relative border-b border-gray-100 bg-gray-25 p-6', {
        'rounded-xl': isCollapsed,
      })}
    >
      <div className=" flex items-center justify-between">
        <Typography variant="title-18">Playground</Typography>
        <div className="flex items-center gap-2">
          <button
            onClick={onExternalPreview}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-gray-700 transition-colors `}
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
          >
            <PanelCloseIcon
              className={cn('h-3 w-3 text-gray-400 transition-transform duration-300', {
                'rotate-0': !isCollapsed,
                'rotate-180': isCollapsed,
              })}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanelHeader;
