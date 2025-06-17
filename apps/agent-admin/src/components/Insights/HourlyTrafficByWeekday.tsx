import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import useSessionInsightsQuery from '../../queries/query/useSessionInsightsQuery';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@meaku/tailwind-config';
import { DayOfWeek, HourlySessionInsightsResponse } from '@meaku/core/types/admin/api';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fullConfig = resolveConfig(tailwindConfig as any);
const colors = fullConfig.theme.colors;
const CURRENT_LINE_COLOR = '#4E46DC';
const chartHeightMultiplier = 1.1;

interface HourlyTrafficByWeekdayProps {
  start_date: string;
  end_date: string;
  timezone: string;
  currentDayOfWeek?: DayOfWeek;
}

export default function HourlyTrafficByWeekday({
  start_date,
  end_date,
  timezone,
  currentDayOfWeek,
}: HourlyTrafficByWeekdayProps) {
  const { data, isLoading } = useSessionInsightsQuery<HourlySessionInsightsResponse>({
    start_date,
    end_date,
    timezone,
    insight_interval: 'hourly',
  });
  const { hourly_pattern, overall_average = {}, timezone: timezoneString } = data ?? {};
  const dayOfWeekHourlyInsightData = currentDayOfWeek ? (hourly_pattern?.[currentDayOfWeek] ?? {}) : {};

  const transformedData = Object.keys(dayOfWeekHourlyInsightData).map((hour: string) => ({
    hour,
    average: overall_average[hour],
    current: dayOfWeekHourlyInsightData[hour],
  }));

  const currentMaxValue = Math.max(...transformedData.map((item) => item.current));
  const averageMaxValue = Math.max(...transformedData.map((item) => item.average));
  const maxBound = Math.ceil(Math.max(currentMaxValue, averageMaxValue) * chartHeightMultiplier);

  return (
    <div className="relative flex flex-auto flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Hourly Traffic Patterns By Weekday</h2>

        <div className="flex gap-4">
          {isLoading || !currentDayOfWeek ? (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </>
          ) : (
            <>
              <Badge dotColor={`[${CURRENT_LINE_COLOR}]`} label={currentDayOfWeek as string} />
              <Badge dotColor="gray-400" label="Overall Average" />
            </>
          )}
        </div>
      </div>

      <span className="text-center text-xs text-gray-500">Hourly Traffic Patterns (All Days with Overall Average)</span>

      <div className="h-[312px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transformedData} margin={{ top: 6, right: 10, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="6 6" stroke={colors.gray[200]} horizontal={true} vertical={true} />
            <XAxis
              dataKey="hour"
              label={{
                value: `Hour of Day (24h format, ${timezoneString})`,
                fontSize: 12,
                color: colors.gray[400],
                position: 'insideBottom',
                offset: -25,
                style: { textAnchor: 'middle' },
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: colors.gray[500] }}
              dy={8}
            />
            <YAxis
              label={{
                value: 'Number of Sessions',
                angle: -90,
                fontSize: 12,
                color: colors.gray[400],
                position: 'left',
                offset: 0,
                style: { textAnchor: 'middle' },
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: colors.gray[500] }}
              domain={[0, maxBound]}
            />
            <Tooltip
              content={
                // @ts-expect-error tooltip prop
                <HourlyTrafficByWeekdayTooltip
                  averageMaxValue={averageMaxValue}
                  currentMaxValue={currentMaxValue}
                  currentDayOfWeek={currentDayOfWeek}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke={CURRENT_LINE_COLOR}
              strokeWidth={3}
              // @ts-expect-error dot prop type
              dot={<PeakDot maxValue={currentMaxValue} valueField="current" stroke={CURRENT_LINE_COLOR} />}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke={colors.gray[400]}
              strokeWidth={3}
              // @ts-expect-error dot prop type
              dot={<PeakDot maxValue={averageMaxValue} valueField="average" stroke={colors.gray[500]} />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-4 text-center text-xs text-gray-400">
        Note: The analysis is based on the data available for the selected time period. Consider analyzing longer time
        periods for more accurate trends.
      </div>
    </div>
  );
}

const Badge = ({ dotColor, label }: { dotColor: string; label: string }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-25 px-3 py-2">
      <div className={`h-3 w-3 rounded-sm bg-${dotColor}`}></div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};

interface PeakDotProps {
  payload: { average: number; current: number };
  cx: number;
  cy: number;
  maxValue: number;
  valueField: 'current' | 'average';
  stroke?: string;
}

const PeakDot = ({ payload, cx, cy, maxValue, valueField, stroke }: PeakDotProps) => {
  if (payload[valueField] === maxValue) {
    return <circle cx={cx} cy={cy} r={4} fill={colors.white} stroke={stroke} strokeWidth={2} />;
  }

  return null;
};

interface HourlyTrafficByWeekdayTooltipProps {
  active: boolean;
  payload: { payload: { current: number; average: number } }[];
  label: string;
  averageMaxValue: number;
  currentMaxValue: number;
  currentDayOfWeek?: DayOfWeek;
}

const HourlyTrafficByWeekdayTooltip = ({
  active,
  payload,
  label,
  averageMaxValue,
  currentMaxValue,
  currentDayOfWeek,
}: HourlyTrafficByWeekdayTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const current = payload[0]?.payload?.current;
  const average = payload[0]?.payload?.average;
  const isAveragePeak = average === averageMaxValue;
  const isCurrentPeak = current === currentMaxValue;
  let tooltipContent = '';
  const currentSessionText = current > 1 ? 'sessions' : 'session';
  const averageSessionText = average > 1 ? 'sessions' : 'session';

  if (isAveragePeak) {
    tooltipContent = `Overall Peak: ${label}:00 (${average} avg ${averageSessionText})`;
  } else if (isCurrentPeak) {
    tooltipContent = `${currentDayOfWeek as string} Peak: ${label}:00 - ${current} ${currentSessionText} (${average} avg ${averageSessionText})`;
  } else {
    tooltipContent = `${label}:00 - ${current} ${currentSessionText} (${average} avg ${averageSessionText})`;
  }

  return (
    <div className="flex items-center rounded-lg bg-white p-2 text-xs text-gray-700 shadow-lg">{tooltipContent}</div>
  );
};
