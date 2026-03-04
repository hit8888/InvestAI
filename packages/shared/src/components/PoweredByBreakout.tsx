import { Typography } from '@neuraltrade/saral';
import { useCommandBarStore } from '../stores';

const PoweredByBreakout = () => {
  const { config } = useCommandBarStore();
  const sessionId = config.session_id;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const getBreakoutUrl = () => {
    const url = new URL('https://getbreakout.ai');
    url.searchParams.append('utm_source', pageUrl);
    url.searchParams.append('utm_medium', sessionId || '');
    return url.toString();
  };

  return (
    <div className="group flex items-center justify-center gap-1">
      <a href={getBreakoutUrl()} target="_blank" rel="noopener noreferrer">
        <Typography className="group-hover:text-gray-500 text-[10px] text-gray-400 font-medium hover:underline hover:decoration-solid hover:underline-offset-auto">
          Powered by <span className="text-gray-500 group-hover:text-gray-500 font-semibold">breakout</span>
        </Typography>
      </a>
    </div>
  );
};

export default PoweredByBreakout;
