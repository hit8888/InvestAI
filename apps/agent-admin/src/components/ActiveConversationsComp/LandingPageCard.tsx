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
      <div className="flex justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Typography variant="label-14-medium" textColor="default">
              Landing page:
            </Typography>
            <Link to={url} target="_blank" rel="noopener noreferrer" className="truncate">
              <Typography variant="body-14" className="flex-1 truncate text-blue_sec-1000">
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
          <div className="flex items-center gap-2">
            <Typography variant="caption-12-normal" textColor="gray500">
              Source: {toSentenceCase(source)}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageCard;
