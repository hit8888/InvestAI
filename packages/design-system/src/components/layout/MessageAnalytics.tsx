import { Badge } from '@breakout/design-system/components/layout/badge';
import { MessageAnalyticsEventData } from '@meaku/core/types/webSocketData';
import Typography from '../Typography';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';

interface IProps {
  analytics: MessageAnalyticsEventData;
}

const MessageAnalytics = ({ analytics }: IProps) => {
  const buyerIntentScoreRef = useElementScrollIntoView<HTMLDivElement>();
  if (!analytics || !analytics.buyer_intent_score) {
    return null;
  }

  return (
    <div ref={buyerIntentScoreRef} className="my-4 flex items-center gap-3">
      <Typography variant="label-14-semibold" textColor="textPrimary">
        Analytics:
      </Typography>
      <Badge className="bg-primary">Buyer Intent Score: {analytics.buyer_intent_score.toFixed(0)}</Badge>
    </div>
  );
};

export default MessageAnalytics;
