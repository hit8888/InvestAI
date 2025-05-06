import AgentConfigHeader from '../components/AgentConfigComponent/AgentConfigHeader';
import withAgentConfigWrapper from './AgentConfigWrapper';

const DataSourcesPage = () => {
  return (
    <div className="flex-start flex w-full flex-col gap-11 self-stretch">
      <AgentConfigHeader headerLabel="Data Sources" />
    </div>
  );
};

export default withAgentConfigWrapper(DataSourcesPage);
