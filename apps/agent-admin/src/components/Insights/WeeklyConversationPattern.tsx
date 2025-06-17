import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts';
import { CalendarDays, Calendar } from 'lucide-react';
import useSessionInsightsQuery from '../../queries/query/useSessionInsightsQuery';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@meaku/tailwind-config';
import { DayOfWeek, WeeklySessionInsightsResponse } from '@meaku/core/types/admin/api';
import { useEffect, useState } from 'react';
import InsightInfo from './InsightInfo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fullConfig = resolveConfig(tailwindConfig as any);
const colors = fullConfig.theme.colors;
const chartHeightMultiplier = 1.1;

interface WeeklyConversationPatternProps {
  start_date: string;
  end_date: string;
  timezone: string;
  onDaySelection?: (dayOfWeek: DayOfWeek) => void;
}

export default function WeeklyConversationPattern({
  start_date,
  end_date,
  timezone,
  onDaySelection,
}: WeeklyConversationPatternProps) {
  const { data, isLoading } = useSessionInsightsQuery<WeeklySessionInsightsResponse>({
    start_date,
    end_date,
    timezone,
    insight_interval: 'weekly',
  });
  const { weekly_pattern = [], busiest_day, quietest_day } = data ?? {};
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>(busiest_day);

  useEffect(() => {
    if (busiest_day) {
      setSelectedDay(busiest_day);
      onDaySelection?.(busiest_day);
    }
  }, [busiest_day]);

  const maxBound = Math.max(...weekly_pattern.map((d) => d.average)) * chartHeightMultiplier;

  const handleDayBarClick = (e: { payload: { day: DayOfWeek } }) => {
    const dayOfWeek = e.payload.day;
    setSelectedDay(dayOfWeek);
    onDaySelection?.(dayOfWeek);
  };

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Conversation Distribution</h2>
      <div className="mb-6 mt-4 flex items-center gap-8">
        <InsightInfo
          icon={<CalendarDays width={16} height={16} className="text-primary" />}
          label="Busiest Day"
          value={busiest_day}
          isLoading={isLoading}
        />
        <InsightInfo
          icon={<Calendar width={16} height={16} className="text-primary" />}
          label="Quietest Day"
          value={quietest_day}
          isLoading={isLoading}
        />
      </div>

      <div className="h-[296px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly_pattern} barSize={32}>
            <CartesianGrid strokeDasharray="6 6" stroke={colors.gray[200]} horizontal={true} vertical={true} />

            <Bar
              dataKey="average"
              fill={selectedDay ? '#4E46DC' : '#B8B5F1'}
              radius={[8, 8, 4, 4]}
              onClick={handleDayBarClick}
              style={{ cursor: 'pointer' }}
            >
              {weekly_pattern.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.day === selectedDay ? '#4E46DC' : '#B8B5F1'} />
              ))}
              {/* @ts-expect-error bar label prop */}
              <LabelList dataKey="average" content={WeeklyBarChartCustomLabel} />
            </Bar>

            <XAxis
              dataKey="day"
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
              width={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface WeeklyBarChartCustomLabelProps {
  x: number;
  y: number;
  width: number;
  value: number;
}

const WeeklyBarChartCustomLabel = ({ x, y, width, value }: WeeklyBarChartCustomLabelProps) => {
  return (
    <g>
      <text x={x + width / 2} y={y + 20} fill="#fff" fontSize={12} textAnchor="middle">
        {value}
      </text>
    </g>
  );
};
