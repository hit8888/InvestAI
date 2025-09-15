import { getLocalStorageData } from '@meaku/core/utils/storage-utils';
import { Typography, StarsGradientIcon } from '@meaku/saral';

const PoweredByBreakout = () => {
  const sessionId = getLocalStorageData()?.sessionId;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const getBreakoutUrl = () => {
    const url = new URL('https://getbreakout.ai');
    url.searchParams.append('utm_source', pageUrl);
    url.searchParams.append('utm_medium', sessionId || '');
    return url.toString();
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <StarsGradientIcon className="h-3 w-3 animate-pulse-medium" />
      <a href={getBreakoutUrl()} target="_blank" rel="noopener noreferrer">
        <Typography className="hover:text-gray-500 text-[10px] text-gray-400 hover:underline hover:decoration-solid hover:underline-offset-auto">
          Powered by <span className="text-breakout">Breakout</span>
        </Typography>
      </a>
    </div>
  );
};

export default PoweredByBreakout;
