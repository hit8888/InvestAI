import { Badge } from '@breakout/design-system/components/layout/badge';
import { AnalyticsType } from '@meaku/core/types/chat';

interface IProps {
  analytics: AnalyticsType;
}

const MessageAnalytics = (props: IProps) => {
  const { analytics } = props;
  return (
    <div className="mt-4 flex items-center gap-3 px-4">
      <p className="text-sm font-medium">Analytics:</p>
      <Badge className={'bg-primary/40'}>
        Buyer Intent Score: <span>{analytics.buyer_intent_score}</span>
      </Badge>
    </div>
  );
};

export default MessageAnalytics;
