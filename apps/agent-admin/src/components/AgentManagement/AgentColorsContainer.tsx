import Typography from '@breakout/design-system/components/Typography/index';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';
import AgentTitleAndSubtitleContent from './AgentTitleAndSubtitleContent';
import AgentColorDisplayInput from './AgentColorDisplayInput';

import {
  COLOR_PRIMARY_SUBTITLE,
  COLOR_PRIMARY_TITLE,
  COLOR_SECONDARY_SUBTITLE,
  COLOR_SECONDARY_TITLE,
} from '../../utils/constants';
import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';

type AgentColorsContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

const AgentColorsContainer = ({ agentId, agentConfigs, onUpdate }: AgentColorsContainerProps) => {
  const primaryColor = agentConfigs?.configs['agent_personalization:style']?.primary;
  const secondaryColor = agentConfigs?.configs['agent_personalization:style']?.secondary;
  const handleColorUpdate = async (color: string, isPrimary: boolean) => {
    handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
            primary: isPrimary ? color : primaryColor,
            secondary: isPrimary ? secondaryColor : color,
          },
        },
      },
      agentConfigs,
      onUpdate,
      isPrimary ? 'Primary Color' : 'Secondary Color',
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Typography variant="title-18">Colors</Typography>
      <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6 pt-4">
        {/* Primary Color Element */}
        <div className="flex w-full flex-1 items-center gap-8 self-stretch">
          <AgentTitleAndSubtitleContent title={COLOR_PRIMARY_TITLE} subtitle={COLOR_PRIMARY_SUBTITLE} />
          <AgentColorDisplayInput initialColor={primaryColor} onColorBlur={(color) => handleColorUpdate(color, true)} />
        </div>
        <div className="w-full border-b border-gray-200"></div>
        {/* Secondary Color Element */}
        <div className="flex w-full items-center gap-8 self-stretch">
          <AgentTitleAndSubtitleContent title={COLOR_SECONDARY_TITLE} subtitle={COLOR_SECONDARY_SUBTITLE} />
          <AgentColorDisplayInput
            initialColor={secondaryColor}
            onColorBlur={(color) => handleColorUpdate(color, false)}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentColorsContainer;
