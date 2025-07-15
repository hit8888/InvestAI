import { Badge } from '@breakout/design-system/components/layout/badge';
import { MessageAnalyticsEventData } from '@meaku/core/types/webSocketData';
import Typography from '../../Typography';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import { cn } from '@breakout/design-system/lib/cn';
import { ViewType } from '@meaku/core/types/common';

interface IProps {
  analytics: MessageAnalyticsEventData;
  invertTextColor: boolean;
  viewType: ViewType;
}

const MessageAnalytics = ({ analytics, invertTextColor, viewType }: IProps) => {
  const buyerIntentScoreRef = useElementScrollIntoView<HTMLDivElement>({
    shouldScroll: viewType === ViewType.USER || viewType === ViewType.ADMIN,
  });
  if (!analytics || !analytics.buyer_intent_score) {
    return null;
  }

  return (
    <div ref={buyerIntentScoreRef} className="flex items-center justify-center gap-2">
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
