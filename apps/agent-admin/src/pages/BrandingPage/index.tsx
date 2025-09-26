import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import LLMsTxtContainer from './LLMsTxtContainer';
import AgentOrbContainer from './AgentOrbContainer';
import AgentColorsContainer from './AgentColorsContainer';
import AgentFontStyleContainer from './AgentFontStyleContainer.tsx';
import AgentLogoAndNameContainer from './AgentLogoAndNameContainer';
import AgentIntroMessageContainer from './AgentIntroMessageContainer.tsx';
import PageContainer from '../../components/AgentManagement/PageContainer.tsx';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';

const BrandingPage = () => {
  const agentId = getTenantActiveAgentId();
  const {
    data: agentConfigs,
    isLoading,
    refetch,
    isError,
  } = useAgentConfigsQuery({
    agentId: agentId,
  });

  const hasError = isError || !agentConfigs || !agentConfigs.configs || Object.keys(agentConfigs.configs).length === 0;

  const commonProps = {
    agentId: Number(agentId),
    agentConfigs: agentConfigs!,
    onUpdate: refetch,
  };
  return (
    <PageContainer isLoading={isLoading} heading={'Branding'} error={hasError}>
      <AgentIntroMessageContainer {...commonProps} />
      <AgentLogoAndNameContainer {...commonProps} />
      <AgentColorsContainer {...commonProps} />
      <AgentOrbContainer {...commonProps} />
      <AgentFontStyleContainer {...commonProps} />
      <LLMsTxtContainer />
    </PageContainer>
  );
};

export default BrandingPage;
