import { BrowsedUrl } from '@meaku/core/types/common';
import BrowsedUrlsPreview from '../../../../components/common/BrowsedUrlsPreview';

interface BrowsingHistoryContentProps {
  browsedUrls: BrowsedUrl[];
}

const BrowsingHistoryContent = ({ browsedUrls }: BrowsingHistoryContentProps) => {
  return <BrowsedUrlsPreview browsedUrls={[...(browsedUrls ?? [])].reverse()} />;
};

export default BrowsingHistoryContent;
