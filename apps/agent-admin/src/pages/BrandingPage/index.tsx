import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import AgentLogoAndNameContainer from '../../components/AgentManagement/AgentLogoAndNameContainer';
import AgentColorsContainer from '../../components/AgentManagement/AgentColorsContainer';
import AgentOrbContainer from '../../components/AgentManagement/AgentOrbContainer';
import PageContainer from '../../components/AgentManagement/PageContainer.tsx';

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
    <PageContainer isLoading={isLoading} heading={'Branding'} error={hasError}>
      <AgentLogoAndNameContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      <AgentColorsContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      <AgentOrbContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
    </PageContainer>
  );
};

export default BrandingPage;
