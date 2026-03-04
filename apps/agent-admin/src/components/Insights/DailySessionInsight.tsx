import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import { Calendar, CalendarDays, Dot } from 'lucide-react';
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import useSessionInsightsQuery from '../../queries/query/useSessionInsightsQuery';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@neuraltrade/tailwind-config';
import moment from 'moment-timezone';
import InsightInfo from './InsightInfo';
import { DailySessionInsightsResponse } from '@neuraltrade/core/types/admin/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fullConfig = resolveConfig(tailwindConfig as any);
const colors = fullConfig.theme.colors;

interface DailySessionInsightProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

export default function DailySessionInsight({ start_date, end_date, timezone }: DailySessionInsightProps) {
  const { data, isLoading } = useSessionInsightsQuery<DailySessionInsightsResponse>({
    start_date,
    end_date,
    timezone,
    insight_interval: 'daily',
  });
  const { daily_counts = [], busiest_day, total_conversations } = data ?? {};

  const formattedData = daily_counts.map((d) => ({
    ...d,
    date: moment(d.date).format('DD MMM'),
  }));

  const minBound = Math.floor(Math.min(...daily_counts.map((d) => d.session_count)));
  const maxBound = Math.ceil(Math.max(...daily_counts.map((d) => d.session_count)));

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Daily Session Count</h2>
      <div className="mb-6 mt-4 flex items-center gap-8">
        <InsightInfo
          icon={<PanelConversationIcon {...COMMON_SMALL_ICON_PROPS} />}
          label="Total Conversations"
          value={total_conversations}
          isLoading={isLoading}
        />

        <InsightInfo
          icon={<CalendarDays width={16} height={16} className="text-primary" />}
          label="Busiest Day"
          value={
            <>
              {busiest_day?.date}
              <Dot size={16} />
              {busiest_day?.session_count} convos
            </>
          }
          isLoading={isLoading}
        />
      </div>

      <div className="h-[296px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4E46DC" />
                <stop offset="10%" stopColor="#6059E0" />
                <stop offset="20%" stopColor="#6059E0" />
                <stop offset="30%" stopColor="#716BE3" />
                <stop offset="40%" stopColor="#837EE7" />
                <stop offset="50%" stopColor="#9590EA" />
                <stop offset="60%" stopColor="#A6A2ED" />
                <stop offset="70%" stopColor="#B8B5F1" />
                <stop offset="80%" stopColor="#CAC7F5" />
                <stop offset="90%" stopColor="#D3D0F6" />
                <stop offset="100%" stopColor="#DCDAF8" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="6 6" stroke={colors.gray[200]} horizontal={true} vertical={true} />
            <XAxis
              dataKey="date"
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
              domain={[minBound, maxBound]}
              width={32}
            />
            {/* @ts-expect-error tooltip prop */}
            <Tooltip content={<DailyLineChartTooltip />} />
            <Line
              type="linear"
              dataKey="session_count"
              stroke="url(#gradient1)"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: colors.white,
                strokeWidth: 1,
                stroke: '#8979FF',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface DailyLineChartTooltipProps {
  active: boolean;
  payload: { payload: { session_count: number } }[];
  label: string;
}

const DailyLineChartTooltip = ({ active, payload, label }: DailyLineChartTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="flex items-center rounded-lg bg-white p-2 text-xs text-gray-700 shadow-lg">
      <Calendar size={12} className="mr-2 text-primary" />
      {label}
      <Dot size={20} color={colors.gray[400]} />
      <span>{payload[0]?.payload?.session_count} Convos</span>
    </div>
  );
};
