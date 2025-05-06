import AgentConfigHeader from '../components/AgentConfigComponent/AgentConfigHeader';
import withAgentConfigWrapper from './AgentConfigWrapper';

const WorkflowPage = () => {
  return (
    <div className="flex-start flex w-full flex-col gap-11 self-stretch">
      <AgentConfigHeader headerLabel="Workflow" />
    </div>
  );
};

export default withAgentConfigWrapper(WorkflowPage);
