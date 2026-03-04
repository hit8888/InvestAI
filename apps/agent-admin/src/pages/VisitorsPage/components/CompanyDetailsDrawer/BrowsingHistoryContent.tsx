import { BrowsedUrl } from '@neuraltrade/core/types/common';
import BrowsedUrlsPreview from '../../../../components/common/BrowsedUrlsPreview';

interface BrowsingHistoryContentProps {
  browsedUrls: BrowsedUrl[];
  isLoading?: boolean;
}

const BrowsingHistoryContent = ({ browsedUrls, isLoading }: BrowsingHistoryContentProps) => {
  return <BrowsedUrlsPreview browsedUrls={[...(browsedUrls ?? [])].reverse()} isLoading={isLoading} />;
};

export default BrowsingHistoryContent;
