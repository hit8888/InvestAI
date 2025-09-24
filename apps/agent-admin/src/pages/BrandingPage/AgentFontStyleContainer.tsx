import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';
import { FONT_STYLE_SUBTITLE } from '../../utils/constants';
import BrandingSectionContainer from './BrandingSectionContainer';
import CardTitleAndDescription from '../../components/AgentManagement/CardTitleAndDescription';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import { useState } from 'react';
import { FONT_FAMILY_LIST } from '../../hooks/useFetchFontStyleOptions';

const applyBasicFontUrl = (fontStyle: string) => {
  // Replace all spaces with plus signs
  const formattedFontStyle = fontStyle.trim().replace(/\s+/g, '+');
  const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontStyle}`;
  return fontUrl;
};

type AgentFontStyleContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

const AgentFontStyleContainer = ({ agentId, agentConfigs, onUpdate }: AgentFontStyleContainerProps) => {
  // const font = useFetchFontStyleOptions(); // TODO: we can use this to fetch the font family list from the api
  const [fontStyleValue, setFontStyleValue] = useState<string | null>(
    agentConfigs?.configs['agent_personalization:style']?.font_config?.font_family || null,
  );
  const handleFontStyleUpdate = async (fontStyle: string | null) => {
    const currentFontFamily = agentConfigs?.configs['agent_personalization:style']?.font_config?.font_family;

    // Check if the font style has actually changed
    if (currentFontFamily === fontStyle) {
      return;
    }

    setFontStyleValue(fontStyle);
    handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
            font_config: {
              font_family: (fontStyle || fontStyleValue) ?? '',
              font_url: fontStyle
                ? applyBasicFontUrl(fontStyle)
                : fontStyleValue
                  ? applyBasicFontUrl(fontStyleValue)
                  : undefined,
            },
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Font Style',
    );
  };

  return (
    <BrandingSectionContainer title="Font Style">
      <div className="flex w-full flex-1 items-center gap-8 self-stretch">
        <CardTitleAndDescription description={FONT_STYLE_SUBTITLE} />
        <AgentDropdown
          allowDeselect={false}
          isSearchable
          applyFontFamily
          options={FONT_FAMILY_LIST}
          defaultValue={fontStyleValue ?? ''}
          placeholderLabel="Select Font Style"
          onCallback={handleFontStyleUpdate}
          className="h-11 w-64 rounded-lg px-2 py-3"
          fontToShown="text-sm"
          dropdownOpenClassName="ring-4 ring-gray-200"
          menuContentAlign="end"
          menuContentSide="right"
          showIcon={false}
          menuItemClassName="p-4"
          dropdownMenuHeader="Select a font"
        />
      </div>
    </BrandingSectionContainer>
  );
};

export default AgentFontStyleContainer;
