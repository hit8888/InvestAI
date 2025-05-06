import AgentConfigHeader from '../components/AgentConfigComponent/AgentConfigHeader';
import withAgentConfigWrapper from './AgentConfigWrapper';

const BrandingPage = () => {
  return (
    <div className="flex-start flex w-full flex-col gap-11 self-stretch">
      <AgentConfigHeader headerLabel="Branding" />
    </div>
  );
};

export default withAgentConfigWrapper(BrandingPage);
