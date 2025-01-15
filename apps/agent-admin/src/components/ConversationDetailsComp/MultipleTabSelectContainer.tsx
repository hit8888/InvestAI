import { ConversationDetailsTabsLabelEnum, ConversationDetailsTabsValueEnum } from '../../utils/constants';
import SingleTabDisplay from './SingleTabDisplay';

import ActivityTabIcon from '@breakout/design-system/components/icons/activity-tab-icon';
import SummaryTabIcon from '@breakout/design-system/components/icons/summary-tab-icon';
import LogTabIcon from '@breakout/design-system/components/icons/log-tab-icon';
import { cn } from '@breakout/design-system/lib/cn';
import SummaryTabDisplayContent from './SummaryTabDisplayContent';
import LogTabDisplayContent from './LogTabDisplayContent';
import ActivityTabDisplayContent from './ActivityTabDisplayContent';

type IProps = {
  currentTab: ConversationDetailsTabsValueEnum;
  handleTabClick: (value: ConversationDetailsTabsValueEnum) => void;
};

type TabConfig = {
  value: ConversationDetailsTabsValueEnum;
  label: string;
  icon: React.ElementType; // Icon component type
  content: React.ReactNode; // Tab content
  isActive: boolean; // To determine if the tab is active or not
};

const MultipleTabSelectContainer = ({ currentTab, handleTabClick }: IProps) => {
  const tabs: TabConfig[] = [
    {
      value: ConversationDetailsTabsValueEnum.SUMMARY_TAB,
      label: ConversationDetailsTabsLabelEnum.SUMMARY_TAB_LABEL,
      icon: SummaryTabIcon,
      content: <SummaryTabDisplayContent />,
      isActive: currentTab === ConversationDetailsTabsValueEnum.SUMMARY_TAB,
    },
    {
      value: ConversationDetailsTabsValueEnum.LOG_TAB,
      label: ConversationDetailsTabsLabelEnum.LOG_TAB_LABEL,
      icon: LogTabIcon,
      content: <LogTabDisplayContent />,
      isActive: currentTab === ConversationDetailsTabsValueEnum.LOG_TAB,
    },
    {
      value: ConversationDetailsTabsValueEnum.ACTIVITY_TAB,
      label: ConversationDetailsTabsLabelEnum.ACTIVITY_TAB_LABEL,
      icon: ActivityTabIcon,
      content: <ActivityTabDisplayContent />,
      isActive: currentTab === ConversationDetailsTabsValueEnum.ACTIVITY_TAB,
    },
  ];

  return (
    <div className="flex flex-1 flex-col items-start self-stretch border-b border-t border-primary/10 pt-4">
      <div className="flex items-start self-stretch border-b border-primary/10">
        {tabs.map(({ value, label, icon: Icon, isActive }) => (
          <SingleTabDisplay
            key={value}
            handleTabClick={() => handleTabClick(value)}
            tabLabel={label}
            isTabSelected={isActive}
          >
            <Icon
              width="16"
              height="16"
              className={cn({
                'text-primary': isActive,
                'text-primary/60': !isActive,
              })}
            />
          </SingleTabDisplay>
        ))}
      </div>
      {tabs.map(({ content, isActive }) => isActive && <>{content}</>)}
    </div>
  );
};

export default MultipleTabSelectContainer;
