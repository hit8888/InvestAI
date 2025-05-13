import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { BrandingShimmer } from '../../components/Shimmer/BrandingShimmer';
import AgentLogoAndNameContainer from '../../components/AgentManagement/AgentLogoAndNameContainer';
import AgentColorsContainer from '../../components/AgentManagement/AgentColorsContainer';
import AgentOrbContainer from '../../components/AgentManagement/AgentOrbContainer';
import BrandingPageErrorState from './ErrorState';
import PageContainer from '../../components/AgentManagement/PageContainer.tsx';

const BrandingPage = () => {
  const agentId = 1; // All tenants using agent 1
  const {
    data: agentConfigs,
    isLoading,
    refetch,
  } = useAgentConfigsQuery({
    agentId: agentId,
  });

  if (isLoading) {
    return <BrandingShimmer />;
  }

  if (!agentConfigs || !agentConfigs.configs || Object.keys(agentConfigs.configs).length === 0) {
    return <BrandingPageErrorState agentId={agentId} />;
  }

  return (
    <PageContainer heading={'Branding'}>
      <AgentLogoAndNameContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      <AgentColorsContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      <AgentOrbContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
    </PageContainer>
  );
};

export default BrandingPage;
