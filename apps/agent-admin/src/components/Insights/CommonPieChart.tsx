import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@neuraltrade/tailwind-config';
import { PieChartDataItem } from '../../utils/admin-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fullConfig = resolveConfig(tailwindConfig as any);
const colors = fullConfig.theme.colors;

export const generateDistributionColors = (chartData: PieChartDataItem[]): string[] => {
  const baseColors = [
    colors.breakout.DEFAULT,
    colors.lavender[700],
    colors.destructive[700],
    colors.positive[600],
    colors.blue_sec[600],
    colors.orange_sec[600],
  ];

  const result = [];
  for (let i = 0; i < chartData.length; i++) {
    if (chartData[i].groupedItems && chartData[i].groupedItems!.length > 0) {
      result.push(colors.gray[300]);
    } else {
      result.push(baseColors[i % baseColors.length]);
    }
  }
  return result;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartDataItem;
  }>;
  tooltipSuffix?: string;
  tooltipFormatter?: (name: string) => string;
}

interface CommonPieChartProps {
  data: PieChartDataItem[];
  chartColors: string[] | { [key: string]: string };
  legendFormatter?: (value: string) => string;
  tooltipSuffix?: string;
  tooltipFormatter?: (name: string) => string;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, tooltipFormatter, tooltipSuffix }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const displayName = tooltipFormatter ? tooltipFormatter(data.name) : data.name;
    const hasGroupedItems = data.groupedItems && data.groupedItems.length > 0;

    return (
      <div className="max-w-xs rounded-xl border border-gray-100 bg-white p-4 shadow-xl backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
          <p className="text-sm font-bold capitalize text-gray-900">{displayName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">
            {data.value.toLocaleString()} {tooltipSuffix}
          </p>
          <p className="text-xs text-gray-500">{data.percentage.toFixed(1)}% of total</p>
        </div>

        {hasGroupedItems && (
          <div className="mt-3 border-t border-gray-200 pt-2">
            <p className="mb-2 text-xs font-semibold text-gray-700">Includes:</p>
            <div className="space-y-1">
              {data.groupedItems?.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="mr-2 flex-1 text-gray-600">{item.name}</span>
                  <div className="flex items-center gap-1 whitespace-nowrap text-gray-500">
                    <span>{item.value.toLocaleString()}</span>
                    <span>({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CommonPieChart = ({
  data,
  chartColors,
  legendFormatter,
  tooltipSuffix = 'conversations',
  tooltipFormatter,
  isLoading = false,
}: CommonPieChartProps) => {
  const getColor = (entry: PieChartDataItem, index: number): string => {
    if (Array.isArray(chartColors)) {
      return chartColors[index] || chartColors[index % chartColors.length];
    }
    return chartColors[entry.name] || colors.breakout.DEFAULT;
  };

  if (isLoading) {
    return (
      <div className="flex h-[380px] items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
          {/* Chart skeleton */}
          <div className="mx-auto flex h-64 w-64 animate-pulse items-center justify-center rounded-full bg-gray-200">
            <div className="h-20 w-20 rounded-full bg-white"></div>
          </div>

          {/* Legend skeleton */}
          <div className="mt-6 flex justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-3 w-14 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <defs>
            <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
            </filter>
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="48%"
            labelLine={false}
            outerRadius={145}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={getColor(entry, index)}
                style={{
                  filter: 'brightness(1.1) saturate(1.1)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip tooltipSuffix={tooltipSuffix} tooltipFormatter={tooltipFormatter} />} />
          <Legend
            verticalAlign="bottom"
            height={45}
            formatter={legendFormatter}
            wrapperStyle={{
              fontSize: '14px',
              color: colors.gray[700],
              paddingTop: '8px',
              maxHeight: '60px',
              overflow: 'auto',
              fontWeight: '500',
              lineHeight: '1.2',
              textTransform: 'capitalize',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommonPieChart;
