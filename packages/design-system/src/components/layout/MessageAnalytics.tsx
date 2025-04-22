import { Badge } from '@breakout/design-system/components/layout/badge';
import { MessageAnalyticsEventData } from '@meaku/core/types/webSocketData';
import Typography from '../Typography';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import { cn } from '../../lib/cn';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';

interface IProps {
  analytics: MessageAnalyticsEventData;
}

const MessageAnalytics = ({ analytics }: IProps) => {
  const buyerIntentScoreRef = useElementScrollIntoView<HTMLDivElement>();
  const invertTextColor = useConfigurationApiResponseManager().applyInvertTextColor();
  if (!analytics || !analytics.buyer_intent_score) {
    return null;
  }

  return (
    <div ref={buyerIntentScoreRef} className="my-4 flex items-center gap-3">
      <Typography variant="label-14-semibold" textColor="textPrimary">
        Analytics:
      </Typography>
      <Badge
        className={cn('bg-primary', {
          'text-black': invertTextColor,
        })}
      >
        Buyer Intent Score: {analytics.buyer_intent_score.toFixed(0)}
      </Badge>
    </div>
  );
};

export default MessageAnalytics;
