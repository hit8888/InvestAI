import { useState } from 'react';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';
import Typography from '@breakout/design-system/components/Typography/index';
import CardTitleAndDescription from './CardTitleAndDescription';
import AgentImageUpload from './AgentImageUpload';
import Input from '@breakout/design-system/components/layout/input';
import {
  FULL_LOGO_SUBTITLE,
  FULL_LOGO_TITLE,
  NAME_SUBTITLE,
  NAME_TITLE,
  SQUARE_LOGO_SUBTITLE,
  SQUARE_LOGO_TITLE,
} from '../../utils/constants';
import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';

type AgentLogoAndNameContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

const AgentLogoAndNameContainer = ({ agentId, agentConfigs, onUpdate }: AgentLogoAndNameContainerProps) => {
  const [agentName, setAgentName] = useState(agentConfigs?.name ?? '');

  const configLogo = agentConfigs?.metadata?.logo;
  const configOrbLogo = agentConfigs?.configs?.['agent_personalization:style']?.orb_config?.logo_url;

  const [logo, setLogo] = useState<string | null>(configLogo);
  const [orbLogo, setOrbLogo] = useState<string | null>(configOrbLogo);

  const handleAgentNameUpdate = async () => {
    handleConfigUpdate(agentId, { name: agentName }, agentConfigs, onUpdate, 'Name');
  };

  const handleLogoUpdate = async (newLogo: string) => {
    setLogo(newLogo);
    handleConfigUpdate(
      agentId,
      { metadata: { ...agentConfigs.metadata, logo: newLogo ?? logo } },
      agentConfigs,
      onUpdate,
      'Full Logo',
    );
  };

  const handleOrbLogoUpdate = async (newOrbLogo: string | null) => {
    setOrbLogo(newOrbLogo);
    handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs['agent_personalization:style'],
            orb_config: {
              ...agentConfigs?.configs['agent_personalization:style'].orb_config,
              logo_url: newOrbLogo ?? orbLogo,
            },
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Favicon',
    );
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <Typography variant="title-18">Logo & Name</Typography>
      <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6 pt-4">
        {/* Full Logo Element */}
        <div className="flex w-full items-center gap-8 self-stretch">
          <CardTitleAndDescription title={FULL_LOGO_TITLE} description={FULL_LOGO_SUBTITLE} />
          <AgentImageUpload width="260px" height="60px" initialImage={configLogo} onImageUpdate={handleLogoUpdate} />
        </div>
        <div className="w-full border-b border-gray-200"></div>
        {/* Favicon Element */}
        <div className="flex w-full items-center gap-8 self-stretch">
          <CardTitleAndDescription title={SQUARE_LOGO_TITLE} description={SQUARE_LOGO_SUBTITLE} />
          <AgentImageUpload
            width="60px"
            height="60px"
            isSquareLogo
            initialImage={configOrbLogo}
            onImageUpdate={handleOrbLogoUpdate}
          />
        </div>
        <div className="w-full border-b border-gray-200"></div>
        {/* Agent Name Element */}
        <div className="flex w-full items-center gap-8 self-stretch">
          <CardTitleAndDescription title={NAME_TITLE} description={NAME_SUBTITLE} />
          <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} onBlur={handleAgentNameUpdate} />
        </div>
      </div>
    </div>
  );
};

export default AgentLogoAndNameContainer;
