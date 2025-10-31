import { Block } from '@meaku/core/types/admin/api';
import AskAISpecificSection, { AskAiSpecificData } from './components/AskAISpecificSection';
import BlockPageLayout from './components/BlockPageLayout';
import { useBlockPageState } from './hooks/useBlockPageState';
import AskAIBlockPreview from './AskAIBlockPreview';
// import AskAICallToActionsSection from './components/AskAICallToActionsSection.tsx';
import useBrandingPageAgentConfigsQuery from '../../hooks/useBrandingPageAgentConfigsQuery.tsx';
import { useEffect, useState } from 'react';
// import MessageSoundSettingsSection from './components/MessageSoundSettingsSection.tsx';
import InstructionsSettingsSection from './components/InstructionsSettingsSection.tsx';
import AgentSupportSection from './components/AgentSupportSection.tsx';
import { useScrollToSection } from '../../hooks/useScrollToSection.ts';

interface AskAiBlockPageProps {
  block: Block;
}

/**
 * AskAiBlockPage - Manages Ask AI block configuration
 *
 * Uses the generic useBlockPageState hook and BlockPageLayout component
 * for a clean, DRY implementation.
 */
const AskAiBlockPage = ({ block }: AskAiBlockPageProps) => {
  useScrollToSection();
  const {
    agentConfigs,
    isLoading: isBrandingPageAgentConfigsLoading,
    agentId,
    onUpdate,
  } = useBrandingPageAgentConfigsQuery();
  const avatarUrl = agentConfigs?.configs?.['agent_personalization:style']?.orb_config?.logo_url;
  const introductionValue = agentConfigs?.metadata?.welcome_message?.message;
  // Use the generic hook with typed module config
  const {
    blockVisibilityData,
    moduleConfig,
    pageVisibilityRules,
    handleBlockVisibilityChange,
    handleModuleConfigChange,
    handlePageVisibilityChange,
    handleSave,
    isLoading,
  } = useBlockPageState<AskAiSpecificData>({
    block,
    parseModuleConfig: (config) => ({
      avatar: avatarUrl || '', // TODO: Add correct logic
      cover_image: config?.cover_image || '',
      name: agentConfigs?.name || '',
      introduction: introductionValue || '',
      ctas: config?.ctas || [],
    }),
  });

  const suggestedQuestions = agentConfigs?.metadata?.welcome_message?.suggested_questions || [];

  // Extract CTA names for preview
  // const blockPreviewCtas: CTABlockPreview[] =
  //   'ctas' in moduleConfig && moduleConfig?.ctas && moduleConfig?.ctas?.length > 0
  //     ? moduleConfig.ctas.map((cta: CTAData) => ({
  //         icon: cta.icon,
  //         name: cta.name,
  //       }))
  //     : [];

  const [data, setData] = useState<AskAiSpecificData>({
    avatar: '',
    cover_image: '',
    ctas: [],
    name: '',
    introduction: '',
  });

  useEffect(() => {
    // Only update if we have meaningful data to set
    if (agentConfigs || block) {
      setData({
        avatar: avatarUrl ?? '',
        cover_image: block?.banner?.public_url ?? '',
        name: agentConfigs?.name || '',
        ctas: [],
        introduction: introductionValue ?? '',
      });
    }
  }, [avatarUrl, block, agentConfigs, introductionValue]);

  const handleDataChange = (data: AskAiSpecificData) => {
    setData(data);
  };

  return (
    <BlockPageLayout
      blockType="Ask AI"
      blockVisibilityData={blockVisibilityData}
      pageVisibilityRules={pageVisibilityRules}
      onBlockVisibilityChange={handleBlockVisibilityChange}
      onPageVisibilityChange={handlePageVisibilityChange}
      onSave={handleSave}
      isLoading={isLoading || isBrandingPageAgentConfigsLoading}
      moduleSpecificSection={
        <>
          <AskAISpecificSection
            key="ask-ai-specific-section"
            data={data}
            handleDataChange={handleDataChange}
            onSave={(data) => {
              if (data?.moduleConfig) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { ctas: _, ...rest } = data.moduleConfig;
                handleModuleConfigChange({ ...rest, ctas: moduleConfig.ctas || [] });
                handleSave({ ...data, moduleConfig: { ...rest, ctas: moduleConfig.ctas || [] } });
              }
            }}
            onChange={(d) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { ctas: _, ...rest } = d;
              handleModuleConfigChange({ ...rest, ctas: moduleConfig.ctas || [] });
            }}
            isLoading={isLoading}
            disabled={isLoading}
            agentConfigs={agentConfigs!}
            agentId={agentId}
            onUpdate={onUpdate}
          />
          <InstructionsSettingsSection id="instructions-settings" />
          {/* <MessageSoundSettingsSection /> */}
          {/* <AskAICallToActionsSection
            key="ask-ai-call-to-actions-section"
            initialData={moduleConfig?.ctas}
            onChange={(ctaData: CTAData[]) => handleModuleConfigChange({ ...moduleConfig, ctas: [...ctaData] })}
            isLoading={isLoading}
            disabled={isLoading}
          /> */}
        </>
      }
      previewContent={
        <AskAIBlockPreview
          ctas={[]}
          // ctas={blockPreviewCtas}
          avatar_asset_url={data.avatar}
          banner={data.cover_image}
          name={data.name}
          introduction={data.introduction}
          suggestedQuestions={suggestedQuestions}
        />
      }
      previewContainerClassname="min-h-[200px] w-96 min-w-[40%] pb-0"
      outerClassname="min-h-screen"
    >
      <AgentSupportSection />
    </BlockPageLayout>
  );
};

export default AskAiBlockPage;
