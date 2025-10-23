import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import { FormControl, FormItem, FormLabel } from '@breakout/design-system/components/layout/form';
import { SettingsFormData } from '../PlaygroundPage';
import Label from '@breakout/design-system/components/layout/label';

interface WebsiteBackgroundToggleProps {
  field?: ControllerRenderProps<SettingsFormData, 'addWebsiteBackground'>;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const WebsiteBackgroundToggle: React.FC<WebsiteBackgroundToggleProps> = ({ field, value, onChange }) => {
  if (!field) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-2 py-2 pl-2 pr-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Checkbox
            haveBlackBackground={false}
            checked={value}
            onCheckedChange={onChange}
            className="h-4 w-4 rounded-sm border border-gray-400"
          />
          <Label className="cursor-pointer text-sm font-normal text-gray-900">Add Website Background</Label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-2 py-2 pl-2 pr-3 shadow-sm">
      <FormItem className="flex items-center gap-3 space-y-0">
        <FormControl>
          <Checkbox
            haveBlackBackground={false}
            checked={field.value}
            onCheckedChange={field.onChange}
            className="h-4 w-4 rounded-sm border border-gray-400"
          />
        </FormControl>
        <FormLabel className="cursor-pointer text-sm font-normal text-gray-900">Add Website Background</FormLabel>
      </FormItem>
    </div>
  );
};

export default WebsiteBackgroundToggle;
