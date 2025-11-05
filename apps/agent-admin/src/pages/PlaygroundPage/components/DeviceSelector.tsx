import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';

interface DeviceSelectorProps {
  deviceType: 'desktop' | 'mobile';
  onDeviceTypeChange: (deviceType: 'desktop' | 'mobile') => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ deviceType, onDeviceTypeChange }) => {
  const [isDevicePopoverOpen, setIsDevicePopoverOpen] = useState(false);

  return (
    <Popover open={isDevicePopoverOpen} onOpenChange={setIsDevicePopoverOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="flex h-8 cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-2 py-1">
          {deviceType === 'desktop' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          <span className="text-sm capitalize">{deviceType}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={8}
        align="start"
        className="z-50 w-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
      >
        <div className="flex flex-col">
          <div
            className={`flex cursor-pointer items-center gap-2 rounded-lg ${deviceType === 'desktop' ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-50'} px-4 py-2`}
            onClick={() => {
              onDeviceTypeChange('desktop');
              setIsDevicePopoverOpen(false);
            }}
          >
            <Monitor className="h-4 w-4" />
            <span className="text-sm">Desktop</span>
          </div>
          <div
            className={`flex cursor-pointer items-center gap-2 rounded-lg ${deviceType === 'mobile' ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-50'} px-4 py-2`}
            onClick={() => {
              onDeviceTypeChange('mobile');
              setIsDevicePopoverOpen(false);
            }}
          >
            <Smartphone className="h-4 w-4" />
            <span className="text-sm">Mobile</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeviceSelector;
