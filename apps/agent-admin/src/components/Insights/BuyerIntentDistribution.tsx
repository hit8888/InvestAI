import { TrendingUp, Users } from 'lucide-react';
import InsightInfo from './InsightInfo';
import CommonPieChart, { generateDistributionColors } from './CommonPieChart';
import useBuyerIntentDistributionQuery from '../../queries/query/useBuyerIntentDistribution';
import { BuyerIntent } from '@neuraltrade/core/types/common';
import { processDistributionData } from '../../utils/common';

interface BuyerIntentDistributionProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const BuyerIntentDistribution = ({ start_date, end_date, timezone }: BuyerIntentDistributionProps) => {
  const { data, isLoading } = useBuyerIntentDistributionQuery({
    payload: {
      start_date,
      end_date,
      timezone,
    },
  });

  const { buyer_intent_distribution = [] } = data ?? {};

  const chartData = processDistributionData(buyer_intent_distribution, 'buyer_intent', 5, 'Other Intent Levels');

  const totalCount = buyer_intent_distribution.reduce((sum, item) => sum + item.count, 0);
  const highIntentItem = buyer_intent_distribution.find((item) => item.buyer_intent === BuyerIntent.HIGH);
  const highIntentPercentage = highIntentItem ? `${highIntentItem.percentage.toFixed(1)}%` : '0%';

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Buyer Intent Distribution</h2>
      <div className="mb-6 mt-4 flex items-center gap-8">
        <InsightInfo
          icon={<TrendingUp width={16} height={16} className="text-primary" />}
          label="High Intent"
          value={highIntentPercentage}
          isLoading={isLoading}
        />
        <InsightInfo
          icon={<Users width={16} height={16} className="text-primary" />}
          label="Total Conversations"
          value={totalCount}
          isLoading={isLoading}
        />
      </div>

      <CommonPieChart
        data={chartData}
        chartColors={generateDistributionColors(chartData)}
        legendFormatter={(value) => `${value.toLowerCase()} Intent`}
        tooltipFormatter={(name) => `${name.toLowerCase()} Intent`}
        tooltipSuffix="conversations"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BuyerIntentDistribution;
