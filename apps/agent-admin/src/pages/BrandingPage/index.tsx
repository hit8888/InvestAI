import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import AgentLogoAndNameContainer from '../../components/AgentManagement/AgentLogoAndNameContainer';
import AgentColorsContainer from '../../components/AgentManagement/AgentColorsContainer';
import AgentOrbContainer from '../../components/AgentManagement/AgentOrbContainer';
import PageContainer from '../../components/AgentManagement/PageContainer.tsx';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import AgentFontStyleContainer from '../../components/AgentManagement/AgentFontStyleContainer.tsx';

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
      <AgentLogoAndNameContainer {...commonProps} />
      <AgentColorsContainer {...commonProps} />
      <AgentOrbContainer {...commonProps} />
      <AgentFontStyleContainer {...commonProps} />
    </PageContainer>
  );
};

export default BrandingPage;
