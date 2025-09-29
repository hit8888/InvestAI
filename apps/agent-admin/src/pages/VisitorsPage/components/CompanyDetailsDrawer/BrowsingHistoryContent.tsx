import { BrowsedUrl } from '@meaku/core/types/common';
import UserActivity from '../../../../components/common/UserActivity';

const BrowsingHistoryContent = ({ browsedUrls }: { browsedUrls: BrowsedUrl[] }) => {
  return (
    <div className="overflow-y-auto p-2">
      <UserActivity browsedUrls={[...(browsedUrls ?? [])].reverse()} />
    </div>
  );
};

export default BrowsingHistoryContent;
