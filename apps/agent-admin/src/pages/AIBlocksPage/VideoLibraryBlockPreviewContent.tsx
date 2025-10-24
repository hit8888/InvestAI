import { BlockTypeEnum } from '@meaku/core/types/admin/api';
import PreviewCardHeader from './components/PreviewCardHeader';
import { BaseBlockPreviewProps } from './types/previewTypes';
import VideoBlockPreviewContent from './components/VideoBlockPreviewContent';
import { VideoStory } from './types/videoTypes';
import PreviewCardDescription from './components/PreviewCardDescription';

interface VideoLibraryBlockPreviewContentProps extends BaseBlockPreviewProps {
  videoLists: VideoStory[];
  tableDataLoading: boolean;
}

/**
 * VideoLibraryBlockPreviewContent - Real-time preview component for Video Library block
 *
 * This component receives dynamic props from the parent page and updates
 * in real-time as the user modifies the content fields.
 *
 * @param iconUrl - Block icon URL (from BlockVisibilityContent)
 * @param headerText - Custom header text (defaults to "Video Library")
 * @param description - Description (from VideoLibraryBlockPage)
 * @param videoLists - Video lists (from VideoLibraryBlockPage)
 * @param tableDataLoading - Table data loading (from VideoLibraryBlockPage)
 */
const VideoLibraryBlockPreviewContent = ({
  iconUrl = '',
  description = '',
  headerText = 'Video Library',
  videoLists,
  tableDataLoading,
}: VideoLibraryBlockPreviewContentProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <PreviewCardHeader blockType={BlockTypeEnum.Enum.VIDEO_LIBRARY} blockIcon={iconUrl} header={headerText} />
      <PreviewCardDescription description={description} />
      <VideoBlockPreviewContent videos={videoLists} isLoading={tableDataLoading} />
    </div>
  );
};

export default VideoLibraryBlockPreviewContent;
