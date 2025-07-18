import { Globe, MapPin } from 'lucide-react';
import InsightInfo from './InsightInfo';
import CommonPieChart, { generateDistributionColors } from './CommonPieChart';
import useCountryDistributionQuery from '../../queries/query/useCountryDistribution';
import { processDistributionData } from '../../utils/common';

interface CountryDistributionProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const CountryDistribution = ({ start_date, end_date, timezone }: CountryDistributionProps) => {
  const { data, isLoading } = useCountryDistributionQuery({
    payload: {
      start_date,
      end_date,
      timezone,
    },
  });

  const { country_distribution = [] } = data ?? {};

  const chartData = processDistributionData(country_distribution, 'country_name', 5, 'Other Countries');

  const topCountry = country_distribution.length > 0 ? country_distribution[0] : null;
  const topCountryText = topCountry ? `${topCountry.country_name} (${topCountry.percentage.toFixed(1)}%)` : 'N/A';

  const countryColors = generateDistributionColors(chartData);

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Country Distribution</h2>
      <div className="mb-6 mt-4 flex items-center gap-8">
        <InsightInfo
          icon={<MapPin width={16} height={16} className="text-primary" />}
          label="Top Country"
          value={topCountryText}
          isLoading={isLoading}
        />
        <InsightInfo
          icon={<Globe width={16} height={16} className="text-primary" />}
          label="Total Countries"
          value={country_distribution.length}
          isLoading={isLoading}
        />
      </div>

      <CommonPieChart
        data={chartData}
        chartColors={countryColors}
        tooltipSuffix="conversations"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CountryDistribution;
