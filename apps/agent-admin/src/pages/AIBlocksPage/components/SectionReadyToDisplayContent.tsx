import Card from '../../../components/AgentManagement/Card';
import Typography from '@breakout/design-system/components/Typography/index';
import ChipWithLabelAndCount from '@breakout/design-system/components/layout/ChipWithLabelAndCount';
import { Settings, ArrowRight } from 'lucide-react';
import Button from '@breakout/design-system/components/Button/index';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../../../stores/useSessionStore';
import { buildPathWithTenantBase } from '../../../utils/navigation';

interface SectionReadyToDisplayContentProps {
  header: string;
  subHeader: string;
  chipLabel: string;
  noVideosMessage: string;
  noVideosDescription: string;
  videoCount: number;
  pathToKnowledgeBase: string;
}

const SectionReadyToDisplayContent = ({
  header,
  subHeader,
  chipLabel,
  noVideosMessage,
  noVideosDescription,
  videoCount,
  pathToKnowledgeBase,
}: SectionReadyToDisplayContentProps) => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';
  const isVideoPresent = videoCount > 0;
  const fullPath = buildPathWithTenantBase(tenantName, pathToKnowledgeBase);

  return (
    <Card background="GRAY25" border="GRAY200">
      <div className="flex flex-1 flex-col items-end gap-6">
        <div className="flex flex-col items-start justify-center gap-2">
          <div className="flex items-center gap-4">
            <Typography variant="label-16-medium">{header}</Typography>
            <ChipWithLabelAndCount label={chipLabel} count={videoCount} />
          </div>
          {isVideoPresent ? (
            <Typography variant="caption-12-normal" textColor="gray500">
              {subHeader}
            </Typography>
          ) : (
            <div className="flex items-center justify-center gap-2.5 rounded-lg border border-warning-200 bg-warning-100 p-2">
              <Settings className="h-4 w-4 text-warning-1000" />
              <div className="flex flex-1 flex-col items-start justify-center gap-0.5">
                <Typography variant="caption-12-medium">{noVideosMessage}</Typography>
                <Typography variant="caption-12-normal" textColor="gray500">
                  {noVideosDescription}
                </Typography>
              </div>
            </div>
          )}
        </div>
        <Link to={fullPath} target="_blank">
          <Button
            variant={isVideoPresent ? 'system_secondary' : 'system'}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            buttonStyle="rightIcon"
          >
            Go to Knowledge Base
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default SectionReadyToDisplayContent;
