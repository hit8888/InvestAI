import Typography from '@breakout/design-system/components/Typography/index';
import DateRangeSelector from '../components/Insights/DateRangeSelector';
import { useMemo, useState } from 'react';
import { DateRangeProp } from '@meaku/core/types/admin/filters';
import Separator from '@breakout/design-system/components/layout/separator';
import Summary from '../components/Insights/Summary';
import moment from 'moment-timezone';
import DailySessionInsight from '../components/Insights/DailySessionInsight';
import WeeklyConversationPattern from '../components/Insights/WeeklyConversationPattern';
import { DayOfWeek } from '@meaku/core/types/admin/api';
import HourlyTrafficByWeekday from '../components/Insights/HourlyTrafficByWeekday';
import FrequentSources from '../components/Insights/FrequentSources';
import TopQuestionsByUsers from '../components/Insights/TopQuestionsByUsers';
import ConversationProcessingTimeLog from '../components/Insights/ConversationProcessingTimeLog';
import { useAuth } from '../context/AuthProvider';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const firstDateOfLastMonth = moment().subtract(1, 'month').startOf('month');
const lastDateOfLastMonth = moment().subtract(1, 'month').endOf('month');
const defaultDateRange = {
  startDate: firstDateOfLastMonth.toDate(),
  endDate: lastDateOfLastMonth.toDate(),
};

const InsightsPage = () => {
  const { userInfo } = useAuth();
  const [currentDateRange, setCurrentDateRange] = useState<DateRangeProp | undefined>(defaultDateRange);
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<DayOfWeek | undefined>(undefined);

  const insightsCommonQueryParams = useMemo(
    () => ({
      start_date: currentDateRange?.startDate ? moment(currentDateRange.startDate).format('YYYY-MM-DD') : '',
      end_date: currentDateRange?.endDate ? moment(currentDateRange.endDate).format('YYYY-MM-DD') : '',
      timezone,
    }),
    [currentDateRange],
  );

  const handleWeeklyChartDaySelection = (dayOfWeek: DayOfWeek) => {
    setCurrentDayOfWeek(dayOfWeek);
  };

  return (
    <div className="flex w-full flex-shrink-0 flex-col items-start gap-4 bg-white p-14">
      <div className="flex-start flex w-full flex-col gap-4 self-stretch">
        <div className="flex w-full justify-between">
          <Typography variant={'title-24'}>Insights</Typography>
          <DateRangeSelector currentDateRange={currentDateRange} onDateChange={setCurrentDateRange} />
        </div>

        <Separator />

        <Summary {...insightsCommonQueryParams} />

        <div className="flex gap-6">
          <DailySessionInsight {...insightsCommonQueryParams} />

          <WeeklyConversationPattern {...insightsCommonQueryParams} onDaySelection={handleWeeklyChartDaySelection} />
        </div>

        <div className="flex flex-grow self-stretch">
          <HourlyTrafficByWeekday {...insightsCommonQueryParams} currentDayOfWeek={currentDayOfWeek} />
        </div>

        <div className="flex gap-12">
          <FrequentSources {...insightsCommonQueryParams} />
          <TopQuestionsByUsers {...insightsCommonQueryParams} />
        </div>
        <div className="flex gap-12">
          {userInfo?.is_staff && <ConversationProcessingTimeLog {...insightsCommonQueryParams} />}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
