import PageContainer from '../../components/AgentManagement/PageContainer';
import { CALENDAR_MANAGEMENT_DESCRIPTION, getTabFromPath } from './utils';
import CalendarList from './CalendarList';
import { useState, useEffect } from 'react';
import { CalendarTabsEnum } from './utils';
import CalComCalendarManager from './CalComCalendarManager';
import CalendarTabs from './CalendarTabs';
import { useLocation } from 'react-router-dom';

const CalendarPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<CalendarTabsEnum>(CalendarTabsEnum.ADD_CALENDAR);

  // Sync active tab with URL path
  useEffect(() => {
    const pathSegment = location.pathname.split('/').pop(); // Get the last segment of the path
    if (pathSegment) {
      const tabFromPath = getTabFromPath(pathSegment);
      setActiveTab(tabFromPath);
    }
  }, [location.pathname]);

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
