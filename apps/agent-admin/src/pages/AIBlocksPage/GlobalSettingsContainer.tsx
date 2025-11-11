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
import Button from '@breakout/design-system/components/Button/index';
import { ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBlocksData } from './hooks/useBlocksData';
import { navigateToSection } from '../../utils/navigation';

const GlobalSettingsContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { blocks } = useBlocksData();
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

  const handleInstructionsEdit = () => {
    const askAiBlock = blocks?.find((b) => b.type === 'ASK_AI');
    if (!askAiBlock) return;
    navigateToSection(navigate, location, `/ai-blocks/${askAiBlock.id}`, 'instructions-settings', 100);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start justify-center gap-6">
      <GlobalSettingsCard>
        {/* Header */}
        <Typography variant="label-16-medium" textColor="black" className="text-lg">
          Global Settings
        </Typography>

        {/* Primary Color Section */}
        <PrimaryColorSection
          primaryColor={primaryColor}
          handleColorChange={handleColorChange}
          handleColorBlur={handleColorBlur}
          isLoading={isLoading}
        />

        {/* Font Style Section */}
        <FontStyleSection fontStyle={fontStyle} handleFontStyleUpdate={handleFontStyleUpdate} />

        {/* Show floating bottom bar Section */}
        <ShowFloatingBottomBarSection
          showFloatingBottomBar={showFloatingBottomBar}
          handleFloatingBarToggle={handleFloatingBarToggle}
          isLoading={isLoading}
        />
      </GlobalSettingsCard>
      <InstructionsCard onEdit={handleInstructionsEdit} />
    </div>
  );
};

const GlobalSettingsCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6 shadow-sm">
      {children}
    </div>
  );
};

type PrimaryColorSectionProps = {
  primaryColor: string;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColorBlur: () => void;
  isLoading: boolean;
};

const PrimaryColorSection = ({
  primaryColor,
  handleColorChange,
  handleColorBlur,
  isLoading,
}: PrimaryColorSectionProps) => {
  return (
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
  );
};

type FontStyleSectionProps = {
  fontStyle: string;
  handleFontStyleUpdate: (newFontStyle: string | null) => Promise<void>;
};

const FontStyleSection = ({ fontStyle, handleFontStyleUpdate }: FontStyleSectionProps) => {
  return (
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
        menuContentAlign="start"
        menuContentSide="right"
        showIcon={false}
        menuItemClassName="p-4"
        dropdownMenuHeader="Fonts"
      />
    </div>
  );
};

type ShowFloatingBottomBarSectionProps = {
  showFloatingBottomBar: boolean;
  handleFloatingBarToggle: (checked: boolean) => void;
  isLoading: boolean;
};

const ShowFloatingBottomBarSection = ({
  showFloatingBottomBar,
  handleFloatingBarToggle,
  isLoading,
}: ShowFloatingBottomBarSectionProps) => {
  return (
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
  );
};

const InstructionsCard = ({ onEdit }: { onEdit: () => void }) => {
  return (
    <GlobalSettingsCard>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <Typography variant="label-16-medium" textColor="black" className="flex-1">
            Instructions
          </Typography>
          <Typography variant="body-14" textColor="gray500">
            Create custom rules to guide the assistant’s behavior using plain English.
          </Typography>
        </div>
        <Button onClick={onEdit} variant="system" buttonStyle="rightIcon" rightIcon={<ArrowRight />}>
          Edit
        </Button>
      </div>
    </GlobalSettingsCard>
  );
};

export default GlobalSettingsContainer;
