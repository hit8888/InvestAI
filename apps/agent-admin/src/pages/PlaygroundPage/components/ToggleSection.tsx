import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Switch } from '@breakout/design-system/components/layout/switch';
import { FormControl, FormItem, FormLabel } from '@breakout/design-system/components/layout/form';
import { Info } from 'lucide-react';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { SettingsFormData } from '../PlaygroundPage';

interface ToggleSectionProps {
  field: ControllerRenderProps<SettingsFormData, 'repeatUser' | 'provideFeedback'>;
  label: string;
  tooltip: string;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ field, label, tooltip }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FormLabel className="text-sm font-medium text-gray-900">{label}</FormLabel>
          <TooltipWrapperDark
            showTooltip
            showArrow={false}
            content={tooltip}
            trigger={<Info className="h-4 w-4 text-primary" />}
            tooltipSide="top"
            tooltipAlign="start"
          />
        </div>
        <FormItem>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-primary"
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
};

export default ToggleSection;
