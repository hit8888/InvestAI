import { getLocalStorageData } from '@meaku/core/utils/storage-utils';
import { Typography, BreakoutGrayLogo, BreakoutGrayText } from '@meaku/saral';

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
    <div className="flex items-center justify-center pb-2">
      <a
        className="group flex justify-center items-center gap-1 pb-0.5"
        href={getBreakoutUrl()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Typography variant="body-small" fontWeight="medium" className="group-hover:text-gray-500 text-foreground/40">
          Powered by
        </Typography>
        <BreakoutGrayLogo className="inline group-hover:text-gray-700" />
        <BreakoutGrayText className="inline group-hover:text-gray-700" />
      </a>
    </div>
  );
};

export default PoweredByBreakout;
