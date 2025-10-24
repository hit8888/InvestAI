import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import useAgentConfigsQuery from '../queries/query/useAgentConfigsQuery';

const useBrandingPageAgentConfigsQuery = () => {
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
