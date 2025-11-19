import PanelCard from './PanelCard';
import Typography from '@breakout/design-system/components/Typography/index';

type BrowsingHistoryCardProps = {
  isActive: boolean;
  onClick: () => void;
};

const BrowsingHistoryCard = ({ isActive, onClick }: BrowsingHistoryCardProps) => {
  return (
    <div>
      <Typography variant="caption-12-medium" className="mb-2 flex items-center gap-1">
        Browsing History
      </Typography>
      <PanelCard isActive={isActive} onClick={onClick}>
        Track the visitor's journey across your site. See what captured their attention.
      </PanelCard>
    </div>
  );
};

export default BrowsingHistoryCard;
