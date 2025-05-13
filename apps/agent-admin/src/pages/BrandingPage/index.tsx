import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { BrandingShimmer } from '../../components/Shimmer/BrandingShimmer';
import AgentLogoAndNameContainer from '../../components/AgentManagement/AgentLogoAndNameContainer';
import AgentColorsContainer from '../../components/AgentManagement/AgentColorsContainer';
import AgentOrbContainer from '../../components/AgentManagement/AgentOrbContainer';
import PageContainer from '../../components/AgentManagement/PageContainer.tsx';
import ErrorState from '../../components/AgentManagement/ErrorState.tsx';

const BrandingPage = () => {
  const agentId = 1; // All tenants using agent 1
  const {
    data: agentConfigs,
    isLoading,
    refetch,
    isError,
  } = useAgentConfigsQuery({
    agentId: agentId,
  });

  const hasError = isError || !agentConfigs || !agentConfigs.configs || Object.keys(agentConfigs.configs).length === 0;

  return (
    <PageContainer
      isLoading={isLoading}
      loadingContent={<BrandingShimmer />}
      heading={'Branding'}
      error={hasError}
      errorContent={<ErrorState agentId={agentId} />}
    >
      <AgentLogoAndNameContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      <AgentColorsContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      <AgentOrbContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
    </PageContainer>
  );
};

export default BrandingPage;
