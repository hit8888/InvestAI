import Card from '../../components/AgentManagement/Card';
import { CommonAIPromptsProps } from './utils';
import PromptHeader from './PromptHeader';
import InfoCard from '../../components/AgentManagement/InfoCard';
import { useEffect, useState } from 'react';
import DefaultInfoIcon from '@breakout/design-system/components/icons/sources-default-info-icon';
import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { getTenantActiveAgentId, getTenantIdentifier } from '@meaku/core/utils/index';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';
import { useAgentConfigsMutation } from '../../queries/mutation/useAgentConfigsMutation';
import { toast } from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
import CustomTabs from '../../components/CustomTabs';
import { AgentResponseWordCountEnum } from '@meaku/core/types/common';
import { AGENT_RESPONSE_IDEAL_LENGTH_TAB_ITEMS } from '../../utils/constants';

const AgentResponseWordCount = ({ title, description }: CommonAIPromptsProps) => {
  const agentId = getTenantActiveAgentId();
  const { data: agentConfig, isError } = useAgentConfigsQuery({
    agentId: agentId,
    enabled: !!agentId,
  });
  const agentResponseWordCount =
    agentConfig?.configs?.['response_generation:prompt']?.response_size_type ?? AgentResponseWordCountEnum.STANDARD; // default value
  const [selectedTab, setSelectedTab] = useState(agentResponseWordCount);

  useEffect(() => {
    if (agentResponseWordCount) {
      setSelectedTab(agentResponseWordCount);
    }
  }, [agentResponseWordCount]);

  // Setup mutation
  const { mutateAsync: updateAgentConfig, isPending: isUpdatingConfig } = useAgentConfigsMutation();

  const updateConfig = async (payload: Partial<AgentConfigPayload>) => {
    if (agentId) {
      try {
        await updateAgentConfig({
          agentId,
          payload,
        });
        toast.success(`Configurations saved successfully`, {
          duration: 3000,
        });
      } catch (e) {
        trackError(e as Error, {
          action: 'Agent Response Word Count update',
          component: 'updateConfig function',
          additionalData: {
            agentId,
            tenantName: getTenantIdentifier()?.['tenant-name'],
            errorMessage: 'Unable to update AgentConfig',
            payload: payload,
          },
        });
        toast.error('Please check if mandatory fields are filled.');
        console.error(e);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value as AgentResponseWordCountEnum);

    if (!agentConfig?.configs) return;

    const payload: Partial<AgentConfigPayload> = {
      configs: {
        'agent_personalization:style': agentConfig.configs['agent_personalization:style'],
        'response_generation:prompt': {
          response_size_type: value as AgentResponseWordCountEnum,
        },
      },
    };

    updateConfig(payload);
  };

  const hasError = isError || !agentConfig || !agentConfig.configs || Object.keys(agentConfig.configs).length === 0;
  if (hasError) {
    return;
  }

  const selectedTabItem = AGENT_RESPONSE_IDEAL_LENGTH_TAB_ITEMS.find((item) => item.itemValue === selectedTab);

  const renderTabInfo = () => {
    return (
      selectedTabItem && (
        <InfoCard
          icon={DefaultInfoIcon}
          title={selectedTabItem.itemInfoTitle || ''}
          description={selectedTabItem.itemDescription || ''}
        />
      )
    );
  };

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <Card background={'GRAY25'} border={'GRAY200'}>
        <CustomTabs
          handleTabChange={handleTabChange}
          tabItems={AGENT_RESPONSE_IDEAL_LENGTH_TAB_ITEMS}
          selectedTab={selectedTab}
          renderTabInfo={renderTabInfo}
          tabDisabled={isUpdatingConfig}
        />
      </Card>
    </div>
  );
};

export default AgentResponseWordCount;
