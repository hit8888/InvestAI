import React from 'react';

import { CalendarCheck2, CalendarPlus } from 'lucide-react';
import { CalendarTabsEnum } from './utils';
import SingleTabDisplay from '../../components/ConversationDetailsComp/SingleTabDisplay';
import { cn } from '@breakout/design-system/lib/cn';

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
  return (
    <div className="sticky top-0 z-10 flex items-start self-stretch border-b border-primary/10 bg-white pt-4">
      {CALENDAR_TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <SingleTabDisplay
            key={label}
            handleTabClick={() => setActiveTab(key)}
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
