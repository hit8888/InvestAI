import { Badge } from '@breakout/design-system/components/layout/badge';
import { MessageAnalyticsEventData } from '@meaku/core/types/webSocketData';
import Typography from '../../Typography';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  analytics: MessageAnalyticsEventData;
  invertTextColor: boolean;
}

const MessageAnalytics = ({ analytics, invertTextColor }: IProps) => {
  if (!analytics || !analytics.buyer_intent_score) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Typography variant="label-14-semibold" textColor="textPrimary">
        Analytics:
      </Typography>
      <Badge
        className={cn('bg-primary py-0 leading-6', {
          'text-black': invertTextColor,
        })}
      >
        Buyer Intent Score: {analytics.buyer_intent_score.toFixed(0)}
      </Badge>
    </div>
  );
};

export default MessageAnalytics;
