import React from 'react';
import BrandingSectionContainer from '../../BrandingPage/BrandingSectionContainer';
import SectionLayout from './SectionLayout';
import CardTitleAndDescription from '../../../components/AgentManagement/CardTitleAndDescription';
import SeparatorLine from './SeparatorLine';
import Input from '@breakout/design-system/components/layout/input';
import AgentImageUpload from '../../BrandingPage/AgentImageUpload';
import AvatarSelectionPopover from '../../BrandingPage/AvatarSelectionPopover';
import { CTABlockPreview, CTAData } from '../utils/blockHelpers';
import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';
import { handleConfigUpdate } from '../../../pages/BrandingPage/utils';
import TextArea from '@breakout/design-system/components/TextArea/index';
import { Asset } from '@meaku/core/types/common';
import { CommonControls, ControlsTitleEnum } from '../../ControlsPage/utils';
import SinglePromptTextarea from '../../ControlsPage/SinglePromptTextarea';
import AgentResponseWordCount from '../../ControlsPage/AgentResponseWordCount';
const { AGENT_PERSONALITY, AGENT_RESPONSE_LENGTH } = ControlsTitleEnum;

export interface AskAiSpecificData {
  avatar: string;
  cover_image: string;
  name: string;
  ctas: CTABlockPreview[] | CTAData[] | undefined;
  introduction: string;
}

type AskAISpecificSectionProps = {
  onChange?: (data: AskAiSpecificData) => void;
  onSave: (data?: { moduleConfig: AskAiSpecificData }) => void;
  isLoading?: boolean;
  disabled?: boolean;
  agentConfigs: AgentConfigResponse;
  agentId: number;
  onUpdate: () => void;
  data: AskAiSpecificData;
  handleDataChange: (data: AskAiSpecificData) => void;
};

const AskAISpecificSection = ({
  onChange,
  onSave,
  isLoading,
  disabled,
  agentConfigs,
  agentId,
  onUpdate,
  data,
  handleDataChange,
}: AskAISpecificSectionProps) => {
  const agentPersonality = CommonControls.find((control) => control.title === AGENT_PERSONALITY)!;
  const agentResponseWordCount = CommonControls.find((control) => control.title === AGENT_RESPONSE_LENGTH)!;
  const handleOnBlurForIntroduction = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const introduction = e.target.value;
    if (introduction === agentConfigs?.metadata?.welcome_message?.message) {
      return;
    }
    handleConfigUpdate(
      agentId,
      {
        metadata: {
          ...agentConfigs.metadata,
          welcome_message: {
            ...agentConfigs.metadata.welcome_message,
            message: introduction,
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Introduction',
    );
  };

  const handleOnBlurForName = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const name = e.target.value;
    if (name === agentConfigs?.name) {
      return;
    }
    handleConfigUpdate(
      agentId,
      {
        name: name,
      },
      agentConfigs,
      onUpdate,
      'Name',
    );
  };

  const handleAvatarChange = (image: string) => {
    handleDataChange({ ...data, avatar: image });
    handleConfigUpdate(
      agentId,
      {
        configs: {
          ...agentConfigs.configs,
          'agent_personalization:style': {
            ...(agentConfigs.configs?.['agent_personalization:style'] ?? {}),
            orb_config: {
              ...(agentConfigs.configs?.['agent_personalization:style']?.orb_config ?? {}),
              logo_url: image,
            },
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Avatar',
    );
  };

  const updateData = (updates: Partial<AskAiSpecificData>) => {
    const newData = { ...data, ...updates };
    handleDataChange(newData);
    onChange?.(newData);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDataChange({ ...data, name: e.target.value });
  };

  const handleIntroductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleDataChange({ ...data, introduction: e.target.value });
  };

  const handleCoverImageChange = (image: string, assetData?: Asset) => {
    updateData({ cover_image: image });
    onSave?.({ moduleConfig: { ...data, cover_image: assetData?.id ?? '' } });
  };
  return (
    <BrandingSectionContainer>
      {/* Block Avatar */}
      <SectionLayout>
        <CardTitleAndDescription
          title="Avatar"
          description="Recommended size: 60x60px (or a square aspect ratio)"
          isMandatoryField={false}
        />
        <AvatarSelectionPopover
          width="60px"
          height="60px"
          isSquareLogo={true}
          initialImage={data.avatar}
          onImageUpdate={handleAvatarChange}
          tooltipText="Please upload the Avatar"
        />
      </SectionLayout>

      <SeparatorLine />

      {/* Block Cover Image */}
      <SectionLayout>
        <CardTitleAndDescription
          title="Cover Image"
          description="Recommended size: 376x100px "
          isMandatoryField={false}
        />
        <AgentImageUpload
          width="250px"
          height="60px"
          initialImage={data.cover_image}
          onImageUpdate={handleCoverImageChange}
          tooltipText="Please upload the Cover Image"
        />
      </SectionLayout>

      <SeparatorLine />

      {/* Block Name */}
      <div className="flex w-full flex-col gap-3">
        <CardTitleAndDescription title="Name" />
        <div className="flex-1">
          <Input
            required
            value={data.name}
            onChange={handleNameChange}
            onBlur={handleOnBlurForName}
            placeholder="e.g. Katy, Max, FinBot, Ava"
            disabled={disabled || isLoading}
            className="h-11 w-full rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
          />
        </div>
      </div>

      {/* Block Introduction */}
      <div className="flex w-full flex-col gap-3">
        <CardTitleAndDescription title="Introduction" />
        <div className="flex-1">
          <TextArea
            required
            value={data.introduction}
            onChange={handleIntroductionChange}
            onBlur={handleOnBlurForIntroduction}
            placeholder="e.g. Your AI copilot for payouts and APIs"
            disabled={disabled || isLoading}
            className="h-11 w-full rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
          />
        </div>
      </div>
      <SeparatorLine />

      <AgentResponseWordCount showTabInfo={false} {...agentResponseWordCount} />
      <SeparatorLine />

      <SinglePromptTextarea key={AGENT_PERSONALITY} {...agentPersonality} />
    </BrandingSectionContainer>
  );
};

export default AskAISpecificSection;
