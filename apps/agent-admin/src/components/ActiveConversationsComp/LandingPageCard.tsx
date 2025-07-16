import { Link } from 'react-router-dom';
import Typography from '@breakout/design-system/components/Typography/index';
import DateUtil from '@meaku/core/utils/dateUtils';
import { toSentenceCase } from '@meaku/core/utils/index';

type LandingPageCardProps = {
  source?: string;
  url?: string;
  timestamp?: string;
};

const LandingPageCard = ({ source, url, timestamp }: LandingPageCardProps) => {
  if (!url) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-4">
            <Typography variant="label-14-medium" textColor="default" className="flex-1">
              Landing page:
            </Typography>
            <Link to={url} target="_blank" rel="noopener noreferrer" className="w-3/4">
              <Typography variant="body-14" className="truncate text-blue_sec-1000">
                {url}
              </Typography>
            </Link>
          </div>
          {timestamp && (
            <Typography variant="caption-12-normal" textColor="gray500">
              {DateUtil.formatDateTime(new Date(timestamp).toISOString())}
            </Typography>
          )}
        </div>
        {source && (
          <Typography variant="caption-12-normal" textColor="gray500" className="truncate">
            Source: {toSentenceCase(source)}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default LandingPageCard;
