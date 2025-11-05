import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Input from '@breakout/design-system/components/layout/input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@breakout/design-system/components/layout/form';
import { Info } from 'lucide-react';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { SettingsFormData } from '../PlaygroundPage';

interface VisitorCompanyInputProps {
  field: ControllerRenderProps<SettingsFormData, 'visitorCompany'>;
}

const VisitorCompanyInput: React.FC<VisitorCompanyInputProps> = ({ field }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FormLabel className="text-sm font-medium text-gray-900">Visitor Company</FormLabel>
        <TooltipWrapperDark
          showTooltip
          showArrow={false}
          content="Enter the company name of the user whose experience you want to simulate"
          trigger={<Info className="h-4 w-4 text-gray-900" />}
          tooltipSide="top"
          tooltipAlign="start"
        />
      </div>
      <FormItem>
        <FormControl>
          <Input
            {...field}
            className="h-11 border-gray-300 focus:border-gray-400 focus:ring-0"
            placeholder="Enter company name"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
};

export default VisitorCompanyInput;
