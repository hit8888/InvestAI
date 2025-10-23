import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Monitor, Smartphone } from 'lucide-react';
import CustomTabs from '../../../components/CustomTabs';
import { SettingsFormData } from '../PlaygroundPage';

interface DeviceTypeSwitcherProps {
  field: ControllerRenderProps<SettingsFormData, 'deviceType'>;
}

const DeviceTypeSwitcher: React.FC<DeviceTypeSwitcherProps> = ({ field }) => {
  return (
    <CustomTabs
      selectedTab={field.value}
      handleTabChange={field.onChange}
      tabItems={[
        {
          itemKey: 'desktop',
          itemValue: 'desktop',
          itemTitle: 'Desktop',
          itemIcon: <Monitor className="h-4 w-4" />,
        },
        {
          itemKey: 'mobile',
          itemValue: 'mobile',
          itemTitle: 'Mobile',
          itemIcon: <Smartphone className="h-4 w-4" />,
        },
      ]}
      classes={{
        container: 'rounded-full bg-gray-100',
        trigger:
          'flex-1 rounded-full px-4 py-2 text-gray-500 transition-all flex items-center justify-center gap-2 min-w-0',
        triggerSelected: 'bg-white text-gray-900 ring-1 ring-gray-200 shadow-sm',
        triggerUnselected: 'hover:text-gray-700',
      }}
    />
  );
};

export default DeviceTypeSwitcher;
