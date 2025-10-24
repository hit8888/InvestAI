import Typography from '@breakout/design-system/components/Typography/index';
import ColorPicker from '@breakout/design-system/components/ColorPicker/index';
import Input from '@breakout/design-system/components/layout/input';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import { Switch } from '@breakout/design-system/components/layout/switch';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@breakout/design-system/components/Tooltip/index';
import DefaultInfoIcon from '@breakout/design-system/components/icons/sources-default-info-icon';
import { FONT_FAMILY_LIST } from '../../hooks/useFetchFontStyleOptions';
import { useGlobalSettings } from './hooks/useGlobalSettings';

const GlobalSettingsContainer = () => {
  const {
    primaryColor,
    fontStyle,
    showFloatingBottomBar,
    isLoading,
    handlePrimaryColorUpdate,
    handleFontStyleUpdate,
    handleFloatingBarToggle,
    setPrimaryColor,
  } = useGlobalSettings();

  // Handle local color input changes
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  // Handle color blur to trigger API update
  const handleColorBlur = () => {
    handlePrimaryColorUpdate(primaryColor);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <Typography variant="label-16-medium" textColor="black" className="text-lg">
        Global Settings
      </Typography>

      {/* Primary Color Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Typography variant="label-14-semibold" textColor="black">
            Primary Color
          </Typography>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <DefaultInfoIcon
                    width={16}
                    height={16}
                    color="#6B7280"
                    className="transition-colors hover:text-gray-400"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-lg border-none bg-gray-900 px-3 py-2 text-xs text-white">
                This color is used for the CTAs
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white py-3 pl-3 pr-4">
          <ColorPicker color={primaryColor} onChange={handleColorChange} sizeClass="h-6 w-6" />
          <Input
            className="h-5 flex-1 border-none bg-transparent p-0 text-sm text-gray-800 outline-none focus:ring-0"
            value={primaryColor}
            onChange={handleColorChange}
            onBlur={handleColorBlur}
            maxLength={7}
            spellCheck={false}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Font Style Section */}
      <div className="flex flex-col gap-3">
        <Typography variant="label-14-medium" textColor="black">
          Font Style
        </Typography>

        <AgentDropdown
          allowDeselect={false}
          isSearchable
          applyFontFamily
          options={FONT_FAMILY_LIST}
          defaultValue={fontStyle}
          placeholderLabel="Select Font Style"
          onCallback={handleFontStyleUpdate}
          className="h-11 w-full rounded-lg border border-gray-300 px-3 py-3"
          fontToShown="text-sm"
          dropdownOpenClassName="ring-4 ring-gray-200"
          menuContentAlign="end"
          menuContentSide="right"
          showIcon={false}
          menuItemClassName="p-4"
          dropdownMenuHeader="Select a font"
        />
      </div>

      {/* Show floating bottom bar Section */}
      <div className="flex flex-col gap-3">
        <Typography variant="label-14-medium" textColor="black">
          Show floating bottom bar
        </Typography>

        <Typography variant="body-14" textColor="gray500">
          By turning this on, the agent will show up as a floating bottom bar for anyone who has not yet interacted with
          blocks
        </Typography>

        <div className="flex w-fit items-center gap-3 rounded-[10px] border border-gray-200 bg-gray-100 p-2 pr-4">
          <Typography
            variant="label-14-medium"
            textColor={showFloatingBottomBar ? 'gray500' : 'gray400'}
            className="transition-colors"
          >
            {showFloatingBottomBar ? 'Turn On' : 'Turn Off'}
          </Typography>
          <Switch
            checked={showFloatingBottomBar}
            onCheckedChange={handleFloatingBarToggle}
            className="transition-colors data-[state=unchecked]:border-gray-200 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsContainer;
