import { BlockTypeEnum } from '@neuraltrade/core/types/admin/api';
import PreviewCardCTA from './components/PreviewCardCTA';
import PreviewCardHeader from './components/PreviewCardHeader';
import PreviewCardDescription from './components/PreviewCardDescription';
import { BaseBlockPreviewProps } from './types/previewTypes';

/**
 * SummarizeBlockPreview - Real-time preview component for Summarize block
 *
 * This component receives dynamic props from the parent page and updates
 * in real-time as the user modifies the content fields.
 *
 * @param description - Block description (from BlockVisibilityContent)
 * @param iconUrl - Block icon URL (from BlockVisibilityContent)
 * @param headerText - Custom header text (defaults to "Summarize")
 * @param ctaLabel - Button label (defaults to "Summarize This Page")
 */
const SummarizeBlockPreview = ({
  description = '',
  iconUrl = '',
  headerText = 'Summarize',
  ctaLabel = 'Summarize This Page',
}: BaseBlockPreviewProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <PreviewCardHeader blockType={BlockTypeEnum.Enum.SUMMARIZE} blockIcon={iconUrl} header={headerText} />
      <PreviewCardDescription description={description} />
      <PreviewCardCTA btnLabel={ctaLabel} />
    </div>
  );
};

export default SummarizeBlockPreview;
