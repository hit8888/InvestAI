import React from 'react';

import { CalendarCheck2, CalendarPlus } from 'lucide-react';
import { CalendarTabsEnum, getPathFromTab } from './utils';
import SingleTabDisplay from '../../components/ConversationDetailsComp/SingleTabDisplay';
import { cn } from '@breakout/design-system/lib/cn';
import { useNavigate, useLocation } from 'react-router-dom';

type TabConfig = {
  key: CalendarTabsEnum;
  label: string;
  icon: React.ElementType;
};

const CALENDAR_TABS: TabConfig[] = [
  {
    key: CalendarTabsEnum.ADD_CALENDAR,
    label: 'Add Calendar',
    icon: CalendarPlus,
  },
  {
    key: CalendarTabsEnum.CREATE_CALENDAR,
    label: 'Create Calendar',
    icon: CalendarCheck2,
  },
];

type CalendarTabsProps = {
  activeTab: CalendarTabsEnum;
  setActiveTab: (tab: CalendarTabsEnum) => void;
};

const CalendarTabs = ({ activeTab, setActiveTab }: CalendarTabsProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab: CalendarTabsEnum) => {
    setActiveTab(tab);
    const newPath = getPathFromTab(tab);
    // Navigate to the new path while preserving the base path structure
    const basePath = location.pathname.split('/').slice(0, -1).join('/');
    navigate(`${basePath}/${newPath}`);
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
