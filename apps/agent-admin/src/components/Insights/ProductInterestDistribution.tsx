import { Package, ShoppingCart } from 'lucide-react';
import InsightInfo from './InsightInfo';
import CommonPieChart, { generateDistributionColors } from './CommonPieChart';
import useProductInterestDistributionQuery from '../../queries/query/useProductInterestDistribution';
import { processDistributionData } from '../../utils/common';

interface ProductInterestDistributionProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const ProductInterestDistribution = ({ start_date, end_date, timezone }: ProductInterestDistributionProps) => {
  const { data, isLoading } = useProductInterestDistributionQuery({
    payload: {
      start_date,
      end_date,
      timezone,
    },
  });

  const { product_interest_distribution = [] } = data ?? {};

  const chartData = processDistributionData(product_interest_distribution, 'product_name', 5, 'Other Products');

  const topProduct = product_interest_distribution.length > 0 ? product_interest_distribution[0] : null;
  const topProductText = topProduct ? `${topProduct.product_name} (${topProduct.percentage.toFixed(1)}%)` : 'N/A';

  const productColors = generateDistributionColors(chartData);

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Product Interest Distribution</h2>
      <div className="mb-6 mt-4 flex items-center gap-8">
        <InsightInfo
          icon={<ShoppingCart width={16} height={16} className="text-primary" />}
          label="Top Product"
          value={topProductText}
          isLoading={isLoading}
        />
        <InsightInfo
          icon={<Package width={16} height={16} className="text-primary" />}
          label="Total Products"
          value={product_interest_distribution.length}
          isLoading={isLoading}
        />
      </div>

      <CommonPieChart
        data={chartData}
        chartColors={productColors}
        tooltipSuffix="conversations"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductInterestDistribution;
