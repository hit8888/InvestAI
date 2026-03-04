import useLocalStorageSession from '@neuraltrade/core/hooks/useLocalStorageSession';
import Typography from '../Typography';
import StarsGradientIcon from '../icons/stars-gradient-icon';

const PoweredByBreakout = () => {
  const {
    sessionData: { sessionId },
  } = useLocalStorageSession();
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const getBreakoutUrl = () => {
    const url = new URL('https://getbreakout.ai');
    url.searchParams.append('utm_source', pageUrl);
    url.searchParams.append('utm_medium', sessionId || '');
    return url.toString();
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <StarsGradientIcon className="h-4 w-4 animate-pulse-medium" />
      <a href={getBreakoutUrl()} target="_blank" rel="noopener noreferrer">
        <Typography
          variant="caption-12-normal"
          className="hover:text-gray-500 hover:underline hover:decoration-solid hover:underline-offset-auto"
          textColor="gray400"
        >
          Powered by <span className="text-breakout">Breakout</span>
        </Typography>
      </a>
    </div>
  );
};

export default PoweredByBreakout;
