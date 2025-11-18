import Typography from '@breakout/design-system/components/Typography/index';
import DateRangeSelector from '../components/Insights/DateRangeSelector';
import { useMemo, useState } from 'react';
import { DateRangeProp, PresetDateLabel } from '@meaku/core/types/admin/filters';
import Separator from '@breakout/design-system/components/layout/separator';
import Summary from '../components/Insights/Summary';
import moment from 'moment-timezone';
import DateUtil from '@meaku/core/utils/dateUtils';
import DailySessionInsight from '../components/Insights/DailySessionInsight';
import WeeklyConversationPattern from '../components/Insights/WeeklyConversationPattern';
import { DayOfWeek } from '@meaku/core/types/admin/api';
import HourlyTrafficByWeekday from '../components/Insights/HourlyTrafficByWeekday';
import FrequentSources from '../components/Insights/FrequentSources';
import TopQuestionsAskedByUsers from '../components/Insights/TopQuestionsAskedByUsers';
import ConversationProcessingTimeLog from '../components/Insights/ConversationProcessingTimeLog';
import BuyerIntentDistribution from '../components/Insights/BuyerIntentDistribution';
import CountryDistribution from '../components/Insights/CountryDistribution';
import ProductInterestDistribution from '../components/Insights/ProductInterestDistribution';
import { useSessionStore } from '../stores/useSessionStore';
import TopQuestionsClickedByUsers from '../components/Insights/TopQuestionsClickedByUsers';
import { INSIGHTS_DATE_RANGE_PRESET_OPTIONS } from '../utils/constants';

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// Use Last 30 days as default (same logic as SinglePresetDateValue)
const defaultDateRange = DateUtil.getDateRangeForPresetValue(-30);

const InsightsPage = () => {
  const userInfo = useSessionStore((state) => state.userInfo);
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
    <div className="flex w-full flex-shrink-0 flex-col items-start gap-4 bg-white p-4">
      <div className="flex-start flex w-full flex-col gap-4 self-stretch">
        <div className="flex w-full justify-between">
          <Typography variant={'title-24'}>Insights</Typography>
          <DateRangeSelector
            currentDateRange={currentDateRange}
            onDateChange={setCurrentDateRange}
            presetOptions={INSIGHTS_DATE_RANGE_PRESET_OPTIONS}
            defaultPreset={PresetDateLabel.Last30Days}
          />
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
        </div>

        <div className="flex gap-12">
          <TopQuestionsAskedByUsers {...insightsCommonQueryParams} />
          <TopQuestionsClickedByUsers {...insightsCommonQueryParams} />
        </div>

        <div className="flex gap-12">
          <BuyerIntentDistribution {...insightsCommonQueryParams} />
          <CountryDistribution {...insightsCommonQueryParams} />
        </div>

        <div className="flex gap-12">
          <ProductInterestDistribution {...insightsCommonQueryParams} />
        </div>

        {userInfo?.is_staff && <ConversationProcessingTimeLog {...insightsCommonQueryParams} />}
      </div>
    </div>
  );
};

export default InsightsPage;
