import { Badge } from '@breakout/design-system/components/layout/badge';
import { MessageAnalyticsEventData } from '@meaku/core/types/webSocketData';

interface IProps {
  analytics: MessageAnalyticsEventData;
}

const MessageAnalytics = ({ analytics }: IProps) => {
  if (!analytics || !analytics.buyer_intent_score) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <p className="text-sm font-bold text-primary">Analytics:</p>
      {analytics.buyer_intent_score && (
        <Badge className={'bg-primary'}>Buyer Intent Score: {analytics.buyer_intent_score}</Badge>
      )}
    </div>
  );
};

export default MessageAnalytics;
