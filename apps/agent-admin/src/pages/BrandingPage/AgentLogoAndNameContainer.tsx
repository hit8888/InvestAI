import { useState } from 'react';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';
import CardTitleAndDescription from '../../components/AgentManagement/CardTitleAndDescription';
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
import BrandingSectionContainer from './BrandingSectionContainer';

type AgentLogoAndNameContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

const AgentLogoAndNameContainer = ({ agentId, agentConfigs, onUpdate }: AgentLogoAndNameContainerProps) => {
  const [agentName, setAgentName] = useState(agentConfigs?.name ?? '');

  const configLogo = agentConfigs?.metadata?.logo;
  const configOrbLogo = agentConfigs?.configs?.['agent_personalization:style']?.orb_config?.logo_url ?? null;

  const [logo, setLogo] = useState<string | null>(configLogo);
  const [orbLogo, setOrbLogo] = useState<string | null>(configOrbLogo);

  const handleAgentNameUpdate = async () => {
    // Check if the name has actually changed
    if (agentName === agentConfigs?.name) {
      return;
    }
    handleConfigUpdate(agentId, { name: agentName }, agentConfigs, onUpdate, 'Name');
  };

  const handleLogoUpdate = async (newLogo: string) => {
    // Check if the logo has actually changed
    if (newLogo === configLogo) {
      return;
    }
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
    // Check if the orb logo has actually changed
    if (newOrbLogo === configOrbLogo) {
      return;
    }
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
    <BrandingSectionContainer title="Logo & Name">
      {/* Full Logo Element */}
      <SectionLayout>
        <CardTitleAndDescription title={FULL_LOGO_TITLE} description={FULL_LOGO_SUBTITLE} />
        <AgentImageUpload width="260px" height="60px" initialImage={configLogo} onImageUpdate={handleLogoUpdate} />
      </SectionLayout>
      <SeparatorLine />
      {/* Favicon Element */}
      <SectionLayout>
        <CardTitleAndDescription title={SQUARE_LOGO_TITLE} description={SQUARE_LOGO_SUBTITLE} />
        <AgentImageUpload
          width="60px"
          height="60px"
          isSquareLogo
          initialImage={configOrbLogo}
          onImageUpdate={handleOrbLogoUpdate}
        />
      </SectionLayout>
      <SeparatorLine />
      {/* Agent Name Element */}
      <SectionLayout>
        <CardTitleAndDescription title={NAME_TITLE} description={NAME_SUBTITLE} />
        <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} onBlur={handleAgentNameUpdate} />
      </SectionLayout>
    </BrandingSectionContainer>
  );
};

const SeparatorLine = () => {
  return <div className="w-full border-b border-gray-200"></div>;
};

const SectionLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full items-center gap-8 self-stretch">{children}</div>;
};

export default AgentLogoAndNameContainer;
