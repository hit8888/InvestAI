import { BlockTypeEnum } from '@meaku/core/types/admin/api';
import PreviewCardCTA from './components/PreviewCardCTA';
import PreviewCardHeader from './components/PreviewCardHeader';
import PreviewCardDescription from './components/PreviewCardDescription';
import { BaseBlockPreviewProps } from './types/previewTypes';

/**
 * BookMeetingBlockPreview - Real-time preview component for Book a Meeting block
 *
 * This component receives dynamic props from the parent page and updates
 * in real-time as the user modifies the content fields.
 *
 * @param description - Block description (from BlockVisibilityContent)
 * @param iconUrl - Block icon URL (from BlockVisibilityContent)
 * @param headerText - Custom header text (defaults to "Talk To a Human")
 * @param ctaLabel - Button label (defaults to "Talk to Human")
 */
const BookMeetingBlockPreview = ({
  description = '',
  iconUrl = '',
  headerText = 'Talk To a Human',
  ctaLabel = 'Talk to Human',
}: BaseBlockPreviewProps) => {
  return (
    <div className="flex h-full w-full flex-col justify-start gap-4">
      <PreviewCardHeader blockType={BlockTypeEnum.Enum.BOOK_MEETING} blockIcon={iconUrl} header={headerText} />
      <PreviewCardDescription description={description} />
      <PreviewCardCTA btnLabel={ctaLabel} />
    </div>
  );
};

export default BookMeetingBlockPreview;
