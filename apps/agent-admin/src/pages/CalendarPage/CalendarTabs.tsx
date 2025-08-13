import React from 'react';

import { CalendarCheck2, CalendarPlus } from 'lucide-react';
import { CalendarTabsEnum, getPathFromTab, buildNavigationPath } from './utils';
import SingleTabDisplay from '../../components/ConversationDetailsComp/SingleTabDisplay';
import { cn } from '@breakout/design-system/lib/cn';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCalendarTab } from './useCalendarTab';

type TabConfig = {
  key: CalendarTabsEnum;
  label: string;
  icon: React.ElementType;
};

const CALENDAR_TABS: TabConfig[] = [
  {
    key: CalendarTabsEnum.CREATE_CALENDAR,
    label: 'Create Calendar',
    icon: CalendarCheck2,
  },
  {
    key: CalendarTabsEnum.ADD_CALENDAR,
    label: 'Add Calendar',
    icon: CalendarPlus,
  },
];

const CalendarTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = useCalendarTab();

  const handleTabClick = (tab: CalendarTabsEnum) => {
    const newPath = getPathFromTab(tab);
    const navigationPath = buildNavigationPath(location.pathname, newPath);
    navigate(navigationPath);
  };
  return (
    <div className="sticky top-0 z-10 flex items-start self-stretch border-b border-primary/10 bg-white pt-4">
      {CALENDAR_TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <SingleTabDisplay
            key={label}
            handleTabClick={() => handleTabClick(key)}
            tabLabel={label}
            isTabSelected={isActive}
          >
            <Icon
              width="16"
              height="16"
              className={cn({
                'text-white': isActive,
                'text-primary': !isActive,
              })}
            />
          </SingleTabDisplay>
        );
      })}
    </div>
  );
};

export default CalendarTabs;
