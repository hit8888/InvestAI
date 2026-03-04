import { useState } from 'react';
import { GoogleConnect, Availability, EventTypeManager } from '@neuraltrade/shared/components/calendar';
import CustomTabs from '../../components/CustomTabs';
import { CREATE_CALENDAR_TAB_ITEMS, CREATE_CALENDAR_TAB_ITEMS_VALUES } from '../../utils/constants';
import Typography from '@breakout/design-system/components/Typography/index';
import { useUpdateCalendar } from '../../queries/mutation/useCalendarMutations';

const { AVAILABILITY, EVENT_TYPES } = CREATE_CALENDAR_TAB_ITEMS_VALUES;

interface CalComCalendarDisplayProps {
  calendarId: number | undefined;
  username: string | undefined;
}

const CalComCalendarDisplay = ({ calendarId, username }: CalComCalendarDisplayProps) => {
  const [selectedTab, setSelectedTab] = useState(AVAILABILITY);
  const activeTabDetails = CREATE_CALENDAR_TAB_ITEMS.find((item) => item.itemKey === selectedTab);
  const updateCalendarMutation = useUpdateCalendar();

  return (
    <div className="flex w-full min-w-full flex-col gap-8">
      <GoogleConnect />

      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={setSelectedTab}
        tabItems={CREATE_CALENDAR_TAB_ITEMS}
        tabContainerClassName="p-1"
      />
      <div className="flex w-full flex-col gap-2">
        <Typography variant="title-18">{activeTabDetails?.itemTitle}</Typography>
        <Typography variant="body-14" className="text-gray-500">
          {activeTabDetails?.itemDescription}
        </Typography>
      </div>

      {selectedTab === AVAILABILITY && <Availability />}
      {selectedTab === EVENT_TYPES && (
        <EventTypeManager updateCalendarMutation={updateCalendarMutation} calendarId={calendarId} username={username} />
      )}
    </div>
  );
};

export default CalComCalendarDisplay;
