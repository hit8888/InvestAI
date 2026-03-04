import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import PanelInsightsIcon from '@breakout/design-system/components/icons/panel-insights-icon';
import { Calendar, CalendarDays, Dot } from 'lucide-react';
import { COMMON_SMALL_ICON_PROPS } from '../../utils/constants';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@neuraltrade/tailwind-config';
import moment from 'moment-timezone';
import InsightInfo from './InsightInfo';
import useConversationProcessingTimeLogQuery from '../../queries/query/useConversationProcessingTimeLog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fullConfig = resolveConfig(tailwindConfig as any);
const colors = fullConfig.theme.colors;

interface ConversationProcessingTimeLogProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

interface DailyLineChartTooltipProps {
  active: boolean;
  payload: { payload: { processing_time: number } }[];
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
      <span>{payload[0]?.payload?.processing_time} seconds</span>
    </div>
  );
};

function ConversationProcessingTimeLog({ start_date, end_date, timezone }: ConversationProcessingTimeLogProps) {
  const { data, isLoading, isFetched, refetch } = useConversationProcessingTimeLogQuery({
    payload: {
      start_date,
      end_date,
      timezone,
    },
    options: {
      enabled: false,
    },
  });
  const { processing_time_logs = [], average_processing_time, total_entries } = data ?? {};

  const { formattedData, minBound, maxBound } = useMemo(() => {
    const data = processing_time_logs.map((d) => ({
      ...d,
      date: moment(d.user_message_time).format('DD MMM'),
    }));

    const processingTimes = processing_time_logs.map((d) => d.processing_time);
    const min = processingTimes.length > 0 ? Math.floor(Math.min(...processingTimes)) : 0;
    const max = processingTimes.length > 0 ? Math.ceil(Math.max(...processingTimes)) : 10;

    return { formattedData: data, minBound: min, maxBound: max };
  }, [processing_time_logs]);

  const handleFetchData = () => {
    refetch();
  };

  // Early return for initial state (query not enabled)
  if (!isFetched && !isLoading) {
    return (
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">Conversation Processing Time</h2>
        <div className="flex h-[296px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <PanelInsightsIcon {...COMMON_SMALL_ICON_PROPS} className="text-gray-400" />
            </div>
            <p className="mb-2 text-sm font-medium text-gray-600">Data not loaded</p>
            <p className="mb-4 text-xs text-gray-500">Click the button below to fetch</p>
            <button
              onClick={handleFetchData}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Load Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900">Conversation Processing Time</h2>
      <div className="mb-6 mt-4 flex items-center gap-8">
        <InsightInfo
          icon={<PanelInsightsIcon {...COMMON_SMALL_ICON_PROPS} />}
          label="Total Entries"
          value={total_entries}
          isLoading={isLoading}
        />

        <InsightInfo
          icon={<CalendarDays width={16} height={16} className="text-primary" />}
          label="Average Processing Time"
          value={<>{average_processing_time} (seconds)</>}
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
                value: 'Processing Time (seconds)',
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
              dataKey="processing_time"
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

export default ConversationProcessingTimeLog;
