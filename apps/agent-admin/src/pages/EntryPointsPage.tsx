import PageContainer from '../components/AgentManagement/PageContainer';
import Card from '../components/AgentManagement/Card.tsx';
import Section from '../components/AgentManagement/Section.tsx';
import CardItem from '../components/AgentManagement/CardItem.tsx';
import CardTitleAndDescription from '../components/AgentManagement/CardTitleAndDescription.tsx';
import Input from '@breakout/design-system/components/layout/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@breakout/design-system/components/layout/select';
import { Switch } from '@breakout/design-system/components/layout/switch';
import Button from '@breakout/design-system/components/Button/Button';
import { useEffect, useState } from 'react';
import { Plus, PlusIcon } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/Typography';
import useBrandingAgentConfigsQuery from '../queries/query/useAgentConfigsQuery';
import { useAgentConfigsMutation } from '../queries/mutation/useAgentConfigsMutation';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';
import { getDefaultBannerHeader, getDefaultBannerSubHeader } from '@meaku/core/utils/bannerConfig';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { getTenantFromLocalStorage } from '../utils/common.ts';

const EntryPointsPage = () => {
  const tenantName = getTenantFromLocalStorage();
  const orgName = getTenantIdentifier()?.['name'] ?? tenantName;
  const agentId = 1;

  const subHeading =
    'Hover over any editable area in the entry point to customize it. Just click and start typing — your changes will be saved automatically.';

  // State for form values
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isBannerEnabled, setIsBannerEnabled] = useState(false);
  const [entryPointAlignment, setEntryPointAlignment] = useState<string>('CENTER');
  const [bannerHeader, setBannerHeader] = useState<string>('');
  const [bannerSubheader, setBannerSubheader] = useState<string>('');
  const [agentName, setAgentName] = useState<string>('');

  // Fetch agent configs
  const {
    data: agentConfig,
    isLoading,
    error,
  } = useBrandingAgentConfigsQuery({
    agentId,
    enabled: !!agentId,
  });

  // Setup mutation
  const { mutate: updateAgentConfig } = useAgentConfigsMutation();

  const updateConfig = (payload: Partial<AgentConfigPayload>) => {
    if (agentId) {
      updateAgentConfig({
        agentId,
        payload,
      });
    }
  };

  // Initialize form values from API data
  useEffect(() => {
    if (agentConfig) {
      const { configs, metadata, name } = agentConfig;
      const styleConfig = configs['agent_personalization:style'];
      const welcomeMessage = metadata.welcome_message;

      // Set agent name for default values
      setAgentName(name);

      // Set entry point alignment
      setEntryPointAlignment(styleConfig.entry_point_alignment || 'CENTER');

      // Set banner config
      setIsBannerEnabled(styleConfig.banner_config.show_banner);
      setBannerHeader(styleConfig.banner_config.header || getDefaultBannerHeader(agentName));
      setBannerSubheader(styleConfig.banner_config.subheader || getDefaultBannerSubHeader(orgName));

      // Set suggested questions
      setSuggestedQuestions(welcomeMessage.suggested_questions || []);
    }
  }, [agentConfig, agentName, orgName]);

  // Handler for adding a question
  const addQuestion = () => {
    if (suggestedQuestions.length < 2) {
      const newQuestions = [...suggestedQuestions, ''];
      setSuggestedQuestions(newQuestions);

      // Don't update API when adding an empty question
      // The API will be updated when the user fills in the question
    }
  };

  // Handler for updating a question (only updates local state)
  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...suggestedQuestions];
    updatedQuestions[index] = value;
    setSuggestedQuestions(updatedQuestions);

    // No API update on change - will be done on blur
  };

  // Handler for saving questions when input loses focus
  const saveQuestions = () => {
    // Filter out empty questions and update API
    const validQuestions = suggestedQuestions.filter((q) => q.trim() !== '');

    // Only update if we have valid questions and they're different from what we started with
    if (
      validQuestions.length > 0 &&
      JSON.stringify(validQuestions) !== JSON.stringify(agentConfig?.metadata.welcome_message.suggested_questions)
    ) {
      updateWelcomeMessage(validQuestions);

      // Update local state if we filtered out any empty questions
      if (validQuestions.length !== suggestedQuestions.length) {
        setSuggestedQuestions(validQuestions);
      }
    }
  };

  // Handler for updating welcome message
  const updateWelcomeMessage = (questions: string[]) => {
    if (!agentConfig) return;

    // Ensure no empty strings are sent to the API
    const validQuestions = questions.filter((q) => q.trim() !== '');

    if (validQuestions.length === 0) return;

    const payload: Partial<AgentConfigPayload> = {
      metadata: {
        ...agentConfig.metadata,
        welcome_message: {
          ...agentConfig.metadata.welcome_message,
          suggested_questions: validQuestions,
        },
      },
    };

    updateConfig(payload);
  };

  // Handler for updating entry point alignment
  const handleAlignmentChange = (value: string) => {
    setEntryPointAlignment(value);

    if (!agentConfig) return;

    const payload: Partial<AgentConfigPayload> = {
      configs: {
        'agent_personalization:style': {
          ...agentConfig.configs['agent_personalization:style'],
          entry_point_alignment: value,
        },
      },
    };

    updateConfig(payload);
  };

  // Handler for toggling banner
  const handleBannerToggle = (enabled: boolean) => {
    setIsBannerEnabled(enabled);

    if (!agentConfig) return;

    // If enabling banner and header/subheader are empty, set defaults
    let header = bannerHeader;
    let subheader = bannerSubheader;

    if (enabled) {
      if (!header) {
        header = getDefaultBannerHeader(agentName);
        setBannerHeader(header);
      }

      if (!subheader) {
        subheader = getDefaultBannerSubHeader(orgName);
        setBannerSubheader(subheader);
      }
    }

    const payload: Partial<AgentConfigPayload> = {
      configs: {
        'agent_personalization:style': {
          ...agentConfig.configs['agent_personalization:style'],
          banner_config: {
            show_banner: enabled,
            header,
            subheader,
          },
        },
      },
    };

    updateConfig(payload);
  };

  // Handler for updating banner header (local state only)
  const handleBannerHeaderChange = (value: string) => {
    setBannerHeader(value);
  };

  // Handler for saving banner header on blur
  const saveBannerHeader = () => {
    if (!agentConfig || !isBannerEnabled) return;

    // Don't update if the value hasn't changed
    if (bannerHeader === agentConfig.configs['agent_personalization:style'].banner_config.header) return;

    const payload: Partial<AgentConfigPayload> = {
      configs: {
        'agent_personalization:style': {
          ...agentConfig.configs['agent_personalization:style'],
          banner_config: {
            ...agentConfig.configs['agent_personalization:style'].banner_config,
            header: bannerHeader.trim() || getDefaultBannerHeader(agentName),
          },
        },
      },
    };

    updateConfig(payload);
  };

  // Handler for updating banner subheader (local state only)
  const handleBannerSubheaderChange = (value: string) => {
    setBannerSubheader(value);
  };

  // Handler for saving banner subheader on blur
  const saveBannerSubheader = () => {
    if (!agentConfig || !isBannerEnabled) return;

    // Don't update if the value hasn't changed
    if (bannerSubheader === agentConfig.configs['agent_personalization:style'].banner_config.subheader) return;

    const payload: Partial<AgentConfigPayload> = {
      configs: {
        'agent_personalization:style': {
          ...agentConfig.configs['agent_personalization:style'],
          banner_config: {
            ...agentConfig.configs['agent_personalization:style'].banner_config,
            subheader: bannerSubheader.trim() || getDefaultBannerSubHeader(orgName || 'us'),
          },
        },
      },
    };

    updateConfig(payload);
  };

  return (
    <PageContainer heading={'EntryPoints'} subHeading={subHeading} isLoading={isLoading} error={error}>
      <Section heading={'Configuration'}>
        <Card background={'GRAY25'} border={'GRAY200'}>
          <CardItem>
            <CardTitleAndDescription title={'Placement'} isMandatoryField={false} />
            <Select value={entryPointAlignment} onValueChange={handleAlignmentChange}>
              <SelectTrigger className={'flex-1'}>
                <SelectValue placeholder="Select a Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className={'border-b'} value="center">
                  Center
                </SelectItem>
                <SelectItem className={'border-b'} value="right">
                  Right
                </SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          </CardItem>
        </Card>
      </Section>

      <Section heading={'Suggested Questions'}>
        <Card background={'GRAY25'} border={'GRAY200'}>
          {suggestedQuestions.length === 0 ? (
            <CardItem className="flex-col">
              <Typography textColor={'gray500'}>No suggested questions added yet</Typography>
              <Button variant="secondary" size="small" onClick={addQuestion} leftIcon={<Plus size={16} />}>
                Add Question
              </Button>
            </CardItem>
          ) : (
            <>
              {suggestedQuestions.map((question, index) => (
                <CardItem key={index} separator={index < suggestedQuestions.length - 1}>
                  <CardTitleAndDescription title={`Question ${index + 1}`} isMandatoryField={index < 1} />
                  <Input
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    onBlur={saveQuestions}
                  />
                </CardItem>
              ))}
              {suggestedQuestions.length < 2 && (
                <CardItem className={'justify-end'}>
                  <Button
                    size={'small'}
                    buttonStyle={'rightIcon'}
                    variant={'secondary'}
                    rightIcon={<PlusIcon />}
                    onClick={addQuestion}
                  >
                    Add More
                  </Button>
                </CardItem>
              )}
            </>
          )}
        </Card>
      </Section>

      <Section heading={'Banner Configuration'}>
        <Card background={'GRAY25'} border={'GRAY200'}>
          <CardItem separator={isBannerEnabled}>
            <CardTitleAndDescription title={'Enable Banner'} isMandatoryField={false} />
            <Switch checked={isBannerEnabled} onCheckedChange={handleBannerToggle} />
          </CardItem>
          {isBannerEnabled && (
            <>
              <CardItem separator={true}>
                <CardTitleAndDescription title={'Heading'} />
                <Input
                  value={bannerHeader}
                  onChange={(e) => handleBannerHeaderChange(e.target.value)}
                  onBlur={saveBannerHeader}
                  placeholder={getDefaultBannerHeader(agentName)}
                />
              </CardItem>
              <CardItem>
                <CardTitleAndDescription title={'Sub-heading'} />
                <Input
                  value={bannerSubheader}
                  onChange={(e) => handleBannerSubheaderChange(e.target.value)}
                  onBlur={saveBannerSubheader}
                  placeholder={getDefaultBannerSubHeader(orgName)}
                />
              </CardItem>
            </>
          )}
        </Card>
      </Section>
    </PageContainer>
  );
};

export default EntryPointsPage;
