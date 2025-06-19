import Card from '../../components/AgentManagement/Card';
import { CommonAIPromptsProps } from './utils';
import PromptHeader from './PromptHeader';
import InfoCard from '../../components/AgentManagement/InfoCard';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@breakout/design-system/components/shadcn-ui/tabs';
import DefaultInfoIcon from '@breakout/design-system/components/icons/sources-default-info-icon';
import { cn } from '@breakout/design-system/lib/cn';
import useAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { getTenantActiveAgentId, getTenantIdentifier } from '@meaku/core/utils/index';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';
import { useAgentConfigsMutation } from '../../queries/mutation/useAgentConfigsMutation';
import { toast } from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';

enum AgentResponseWordCountEnum {
  BRIEF = 'BRIEF',
  STANDARD = 'STANDARD',
  DETAILED = 'DETAILED',
}

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
  const { mutateAsync: updateAgentConfig } = useAgentConfigsMutation();

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

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <Card background={'GRAY25'} border={'GRAY200'}>
        <Tabs className="flex w-full flex-col items-start gap-4" onValueChange={handleTabChange}>
          {AgentResponseIdealLengthTabItems.map((item) => (
            <TabsContent key={item.itemKey} value={item.itemValue}>
              <InfoCard icon={DefaultInfoIcon} title={item.itemInfoTitle} description={item.itemDescription} />
            </TabsContent>
          ))}
          <TabsList className="mt-2 w-full p-0">
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 p-2">
              {AgentResponseIdealLengthTabItems.map((item) => (
                <TabsTrigger
                  key={item.itemKey}
                  value={item.itemValue}
                  className={cn('flex-1 rounded-full bg-gray-100 p-2 text-gray-500', {
                    'ring-offset bg-white text-gray-900 ring-1 ring-gray-200': selectedTab === item.itemValue,
                  })}
                >
                  {item.itemTitle}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
        </Tabs>
      </Card>
    </div>
  );
};

const AgentResponseIdealLengthTabItems = [
  {
    itemKey: 'brief',
    itemTitle: 'Brief',
    itemInfoTitle: 'Brief:',
    itemDescription:
      "Keep responses under 90 words (40 for low BI use cases). Great for quick answers, tooltips, or simple confirmations that don't require much context.",
    itemValue: AgentResponseWordCountEnum.BRIEF,
  },
  {
    itemKey: 'standard',
    itemTitle: 'Standard',
    itemInfoTitle: 'Standard:',
    itemDescription:
      'Aim for up to 130 words (around 70 for low BI). Best for everyday help — clear, helpful responses with just enough detail to guide the user.',
    itemValue: AgentResponseWordCountEnum.STANDARD,
  },
  {
    itemKey: 'detailed',
    itemTitle: 'Detailed',
    itemInfoTitle: 'Detailed:',
    itemDescription:
      'Allow up to 190 words (100 for low BI). Ideal for step-by-step explanations, nuanced topics, or high-stakes moments that require context and clarity.',
    itemValue: AgentResponseWordCountEnum.DETAILED,
  },
];

export default AgentResponseWordCount;
