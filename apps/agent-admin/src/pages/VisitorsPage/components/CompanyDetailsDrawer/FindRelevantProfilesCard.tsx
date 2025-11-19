import PanelCard from './PanelCard';
import Typography from '@breakout/design-system/components/Typography/index';

type FindRelevantProfilesCardProps = {
  isActive: boolean;
  onClick: () => void;
};

const FindRelevantProfilesCard = ({ isActive, onClick }: FindRelevantProfilesCardProps) => {
  return (
    <div>
      <Typography variant="caption-12-medium" className="mb-2 flex items-center gap-1">
        Find Relevant Profiles
      </Typography>
      <PanelCard isActive={isActive} onClick={onClick}>
        Discover AI-identified profiles of potential leads from your site visitors.
      </PanelCard>
    </div>
  );
};

export default FindRelevantProfilesCard;
