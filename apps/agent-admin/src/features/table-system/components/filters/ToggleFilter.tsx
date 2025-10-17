import { Switch } from '@breakout/design-system/components/layout/switch';
import type { FilterConfig } from '../../types';

interface ToggleFilterProps {
  config: FilterConfig;
  value: boolean;
  onChange: (value: boolean) => void;
}

/**
 * Toggle/Switch filter component
 * Used to enable/disable specific default filters
 */
export const ToggleFilter = ({ config, value, onChange }: ToggleFilterProps) => {
  return (
    <Switch
      id={config.id}
      checked={value}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-gray-300"
    />
  );
};
