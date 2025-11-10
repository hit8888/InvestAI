import useAgentConfigsQuery from '../queries/query/useAgentConfigsQuery';
import { useSessionStore } from '../stores/useSessionStore';

const useBrandingPageAgentConfigsQuery = () => {
  const agentId = useSessionStore((state) => state.activeTenant?.agentId ?? 1);
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

  const onUpdate = () => {
    refetch();
  };

  return {
    agentConfigs,
    isLoading,
    hasError,
    commonProps,
    agentId,
    onUpdate,
  };
};

export default useBrandingPageAgentConfigsQuery;
