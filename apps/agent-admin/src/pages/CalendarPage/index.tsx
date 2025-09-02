import PageContainer from '../../components/AgentManagement/PageContainer';
import { CALENDAR_MANAGEMENT_DESCRIPTION } from './utils';
import CalendarList from './CalendarList';
import { CalendarTabsEnum } from './utils';
import CalComCalendarManager from './CalComCalendarManager';
import CalendarTabs from './CalendarTabs';
import { useCalendarTab } from './useCalendarTab';
import { useMemo } from 'react';

const CalendarPage = () => {
  const currentTab = useCalendarTab();

  const renderTabContent = useMemo(() => {
    switch (currentTab) {
      case CalendarTabsEnum.ADD_CALENDAR:
        return <CalendarList />;
      case CalendarTabsEnum.CREATE_CALENDAR:
        return <CalComCalendarManager />;
      default:
        return <CalComCalendarManager />;
    }
  }, [currentTab]);

  return (
    <PageContainer
      className="max-w-4xl gap-6"
      containerClassName="gap-6"
      heading={'Calendar Management'}
      subHeading={CALENDAR_MANAGEMENT_DESCRIPTION}
    >
      <CalendarTabs />
      {renderTabContent}
    </PageContainer>
  );
};

export default CalendarPage;
