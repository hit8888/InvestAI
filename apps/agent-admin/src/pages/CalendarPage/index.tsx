import PageContainer from '../../components/AgentManagement/PageContainer';
import { CALENDAR_MANAGEMENT_DESCRIPTION } from './utils';
import CalendarList from './CalendarList';
import { useState } from 'react';
import { CalendarTabsEnum } from './utils';
import CalComCalendarManager from './CalComCalendarManager';
import CalendarTabs from './CalendarTabs';

const CalendarPage = () => {
  const [activeTab, setActiveTab] = useState<CalendarTabsEnum>(CalendarTabsEnum.ADD_CALENDAR);

  return (
    <PageContainer
      className="gap-6"
      containerClassName="gap-6"
      heading={'Calendar Management'}
      subHeading={CALENDAR_MANAGEMENT_DESCRIPTION}
    >
      <CalendarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === CalendarTabsEnum.ADD_CALENDAR ? <CalendarList /> : null}
      {activeTab === CalendarTabsEnum.CREATE_CALENDAR ? <CalComCalendarManager /> : null}
    </PageContainer>
  );
};

export default CalendarPage;
