import { BrowsedUrl } from '@meaku/core/types/common';
import BrowsedUrlsPreview from '../../../../components/common/BrowsedUrlsPreview';

const BrowsingHistoryContent = ({ browsedUrls }: { browsedUrls: BrowsedUrl[] }) => {
  return <BrowsedUrlsPreview browsedUrls={[...(browsedUrls ?? [])].reverse()} />;
};

export default BrowsingHistoryContent;
