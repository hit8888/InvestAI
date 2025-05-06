import AgentConfigHeader from '../components/AgentConfigComponent/AgentConfigHeader';
import withAgentConfigWrapper from './AgentConfigWrapper';

const EntryPointsPage = () => {
  return (
    <div className="flex-start flex w-full flex-col gap-11 self-stretch">
      <AgentConfigHeader headerLabel="Entrypoints" />
    </div>
  );
};

export default withAgentConfigWrapper(EntryPointsPage);
