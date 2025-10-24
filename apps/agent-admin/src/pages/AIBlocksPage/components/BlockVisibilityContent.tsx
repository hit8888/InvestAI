import { useState, useEffect } from 'react';
import { Switch } from '@breakout/design-system/components/layout/switch';
import Input from '@breakout/design-system/components/layout/input';

import BrandingSectionContainer from '../../../pages/BrandingPage/BrandingSectionContainer';
import CardTitleAndDescription from '../../../components/AgentManagement/CardTitleAndDescription';
import AgentImageUpload from '../../../pages/BrandingPage/AgentImageUpload';
import SectionLayout from './SectionLayout';
import SeparatorLine from './SeparatorLine';
import { cn } from '@breakout/design-system/lib/cn';
import Typography from '@breakout/design-system/components/Typography/index';
import TextArea from '@breakout/design-system/components/TextArea/index';
import { Asset } from '@meaku/core/types/common';
import { Block } from '@meaku/core/types/admin/api';

export interface BlockVisibilityData {
  isVisible: boolean;
  title: string;
  description?: string;
  iconUrl?: string;
}

const getPlaceholderText = () => {
  const examples = ['Ask AI', 'Demo Widget', 'Schedule Meeting'];
  return `e.g. ${examples.join(', ')} *`;
};

export interface BlockVisibilityContentProps {
  /** Initial data for the block */
  initialData?: Partial<BlockVisibilityData>;
  /** Callback when data changes */
  onChange?: (data: BlockVisibilityData) => void;

  onSave?: (overrides?: { blockVisibilityData?: BlockVisibilityData }) => void;
  /** Block type for default title placeholder */
  blockType?: string;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  showDescription?: boolean;
  blockTitleMaxLength?: number;
  block?: Block;
}

const BlockVisibilityContent: React.FC<BlockVisibilityContentProps> = ({
  initialData = {},
  onChange,
  onSave,
  // blockType,
  isLoading = false,
  disabled = false,
  className,
  showDescription = false,
  blockTitleMaxLength = 100,
  block,
}) => {
  const [data, setData] = useState<BlockVisibilityData>({
    isVisible: initialData.isVisible ?? true,
    title: initialData.title ?? '',
    description: initialData.description ?? '',
    iconUrl: initialData.iconUrl,
  });

  // Sync state with initialData prop changes
  useEffect(() => {
    setData({
      isVisible: initialData.isVisible ?? true,
      title: initialData.title ?? '',
      description: initialData.description ?? '',
      iconUrl: initialData.iconUrl,
    });
  }, [initialData]);

  const updateData = (updates: Partial<BlockVisibilityData>) => {
    const newData = { ...data, ...updates };
    setData(newData);
    onChange?.(newData);
  };

  const handleToggleVisibility = (checked: boolean) => {
    updateData({ isVisible: checked });
    onSave?.({ blockVisibilityData: { ...data, isVisible: checked } });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ title: e.target.value });
  };

  const handleTitleChangeOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data, title: e.target.value };
    if (newData.title === block?.tooltip) {
      return;
    }
    onSave?.({ blockVisibilityData: newData });
  };

  const handleDescriptionChangeOnBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newData = { ...data, description: e.target.value };
    if (newData.description === block?.description) {
      return;
    }
    onSave?.({ blockVisibilityData: newData });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData({ description: e.target.value });
  };

  const getToggleElement = () => {
    return (
      <Switch
        checked={data.isVisible}
        onCheckedChange={handleToggleVisibility}
        disabled={disabled || isLoading}
        thumbHeight="h-4"
        thumbWidth="w-4"
        className="pl-0.5 transition-colors data-[state=unchecked]:border-gray-200 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 data-[state=checked]:ring-2 data-[state=checked]:ring-primary/60"
      />
    );
  };

  const handleBlockIconImageUpload = (image: string, assetData?: Asset) => {
    updateData({ iconUrl: image });
    onSave?.({ blockVisibilityData: { ...data, iconUrl: assetData?.id || undefined } });
  };

  return (
    <div className={className}>
      <BrandingSectionContainer>
        {/* Show Block Toggle */}
        <SectionLayout>
          <CardTitleAndDescription
            title="Block Status"
            description="Enable this to publish the block on your site."
            isMandatoryField={false}
          />
          <div
            className={cn('flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 p-2 pr-3', {
              'text-primary': data.isVisible,
            })}
          >
            <Typography variant="body-14" textColor={'gray500'}>
              {data.isVisible ? 'Published' : 'Unpublished'}
            </Typography>
            {getToggleElement()}
          </div>
        </SectionLayout>

        <SeparatorLine />

        {/* Block Title */}
        <div className="flex w-full flex-col gap-3">
          <CardTitleAndDescription
            showInfoIcon
            title="Block Title"
            tooltipInfo="This is what appears when someone hovers on the icon"
          />
          <div className="flex-1">
            <Input
              required
              value={data.title}
              onChange={handleTitleChange}
              onBlur={handleTitleChangeOnBlur}
              placeholder={getPlaceholderText()}
              maxLength={blockTitleMaxLength}
              disabled={disabled || isLoading}
              className="h-11 w-full rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
            />
          </div>
        </div>

        <SeparatorLine />

        {/* Block Description */}
        {showDescription ? (
          <>
            <div className="flex w-full flex-col gap-3">
              <CardTitleAndDescription title="Block Description" />
              <div className="flex-1">
                <TextArea
                  required
                  value={data.description}
                  onChange={handleDescriptionChange}
                  onBlur={handleDescriptionChangeOnBlur}
                  placeholder="Briefly describe the purpose or content of this form"
                  disabled={disabled || isLoading}
                  className="h-11 w-full rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
                />
              </div>
            </div>

            <SeparatorLine />
          </>
        ) : null}

        {/* Block Icon */}
        <SectionLayout>
          <CardTitleAndDescription
            title="Block Icon"
            description="Recommended size: 20×20px"
            isMandatoryField={false}
          />
          <AgentImageUpload
            width="60px"
            height="60px"
            isSquareLogo={true}
            initialImage={data.iconUrl}
            onImageUpdate={handleBlockIconImageUpload}
            tooltipText="Please upload the Icon"
          />
        </SectionLayout>
      </BrandingSectionContainer>
    </div>
  );
};

export default BlockVisibilityContent;
