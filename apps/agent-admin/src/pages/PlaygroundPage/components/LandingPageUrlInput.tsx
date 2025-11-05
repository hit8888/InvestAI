import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import Input from '@breakout/design-system/components/layout/input';
import { FormControl, FormItem, FormMessage } from '@breakout/design-system/components/layout/form';
import { Link2 } from 'lucide-react';
import { SettingsFormData } from '../PlaygroundPage';

interface LandingPageUrlInputProps {
  field: ControllerRenderProps<SettingsFormData, 'landingPageUrl'>;
}

const LandingPageUrlInput: React.FC<LandingPageUrlInputProps> = ({ field }) => {
  return (
    <FormItem>
      <FormControl>
        <div className="relative">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            {...field}
            className="h-11 border-gray-300 pl-10 pr-10 focus:border-gray-400 focus:ring-0"
            placeholder="Enter current page URL"
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default LandingPageUrlInput;
