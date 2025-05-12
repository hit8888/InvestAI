import AgentConfigHeader from '../../components/AgentConfigComponent/AgentConfigHeader';
import withAgentConfigWrapper from '../AgentConfigWrapper';
import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { BrandingShimmer } from '../../components/Shimmer/BrandingShimmer';
import AgentLogoAndNameContainer from '../../components/AgentConfigComponent/AgentLogoAndNameContainer';
import AgentColorsContainer from '../../components/AgentConfigComponent/AgentColorsContainer';
import AgentOrbContainer from '../../components/AgentConfigComponent/AgentOrbContainer';
import BrandingPageErrorState from './ErrorState';

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
    <div className="flex-start flex w-full flex-col gap-8 self-stretch">
      <AgentConfigHeader headerLabel="Branding" />
      <div className="flex max-w-2xl flex-col gap-12 self-stretch">
        <AgentLogoAndNameContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
        <AgentColorsContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
        <AgentOrbContainer agentId={Number(agentId)} agentConfigs={agentConfigs!} onUpdate={refetch} />
      </div>
    </div>
  );
};

export default withAgentConfigWrapper(BrandingPage);
