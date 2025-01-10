import { useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';

import { ConversationDetailsTabsLabelEnum, ConversationDetailsTabsValueEnum } from '../../utils/constants';

import ActivityTabIcon from '@breakout/design-system/components/icons/activity-tab-icon';
import SummaryTabIcon from '@breakout/design-system/components/icons/summary-tab-icon';
import LogTabIcon from '@breakout/design-system/components/icons/log-tab-icon';
import SingleTabDisplay from './SingleTabDisplay';
import SummaryTabDisplayContent from './SummaryTabDisplayContent';
import LogTabDisplayContent from './LogTabDisplayContent';
import ActivityTabDisplayContent from './ActivityTabDisplayContent';
import RightSideSummaryTabDisplayContent from './RightSideSummaryTabDisplayContent';
import RightSideLogTabDisplayContent from './RightSideLogTabDisplayContent';
import RightSideActivityTabDisplayContent from './RightSideActivityTabDisplayContent';

const ConversationDetailsMultipleTabContainer = () => {
  const [currentTab, setCurrentTab] = useState(ConversationDetailsTabsValueEnum.LOG_TAB);

  const handleTabClick = (tabValue: ConversationDetailsTabsValueEnum) => {
    setCurrentTab(tabValue);
  };
  return (
    <div className="flex w-full flex-1 items-start self-stretch">
      <MultipleTabSelectContainer currentTab={currentTab} handleTabClick={handleTabClick} />
      <RightSideTabDisplayContainer currentTab={currentTab} />
    </div>
  );
};

type IProps = {
  currentTab: ConversationDetailsTabsValueEnum;
  handleTabClick: (value: ConversationDetailsTabsValueEnum) => void;
};

const MultipleTabSelectContainer = ({ currentTab, handleTabClick }: IProps) => {
  const isSummaryTab = currentTab === ConversationDetailsTabsValueEnum.SUMMARY_TAB;
  const isLogTab = currentTab === ConversationDetailsTabsValueEnum.LOG_TAB;
  const isActivityTab = currentTab === ConversationDetailsTabsValueEnum.ACTIVITY_TAB;
  return (
    <div className="flex flex-1 flex-col items-start self-stretch border-b border-t border-primary/10 pt-4">
      <div className="flex items-start self-stretch border-b border-primary/10">
        <SingleTabDisplay
          //   handleTabClick={() => handleTabClick(ConversationDetailsTabsValueEnum.SUMMARY_TAB)}
          handleTabClick={() => ''} // TODOS: KEEPING INACTIVE TAB FOR NOW
          tabLabel={ConversationDetailsTabsLabelEnum.SUMMARY_TAB_LABEL}
          isTabSelected={isSummaryTab}
        >
          <SummaryTabIcon
            width="16"
            height="16"
            className={cn({
              'text-primary': isSummaryTab,
              'text-primary/60': !isSummaryTab,
            })}
          />
        </SingleTabDisplay>
        <SingleTabDisplay
          handleTabClick={() => handleTabClick(ConversationDetailsTabsValueEnum.LOG_TAB)}
          tabLabel={ConversationDetailsTabsLabelEnum.LOG_TAB_LABEL}
          isTabSelected={isLogTab}
        >
          <LogTabIcon
            width="16"
            height="16"
            className={cn({
              'text-primary': isLogTab,
              'text-primary/60': !isLogTab,
            })}
          />
        </SingleTabDisplay>
        <SingleTabDisplay
          //   handleTabClick={() => handleTabClick(ConversationDetailsTabsValueEnum.ACTIVITY_TAB)}
          handleTabClick={() => ''} // TODOS: KEEPING INACTIVE TAB FOR NOW
          tabLabel={ConversationDetailsTabsLabelEnum.ACTIVITY_TAB_LABEL}
          isTabSelected={isActivityTab}
        >
          <ActivityTabIcon
            width="16"
            height="16"
            className={cn({
              'text-primary': isActivityTab,
              'text-primary/60': !isActivityTab,
            })}
          />
        </SingleTabDisplay>
      </div>
      {isSummaryTab ? <SummaryTabDisplayContent /> : null}
      {isLogTab ? <LogTabDisplayContent /> : null}
      {isActivityTab ? <ActivityTabDisplayContent /> : null}
    </div>
  );
};

type TabDisplayProps = {
  currentTab: ConversationDetailsTabsValueEnum;
};

const RightSideTabDisplayContainer = ({ currentTab }: TabDisplayProps) => {
  const isSummaryTab = currentTab === ConversationDetailsTabsValueEnum.SUMMARY_TAB;
  const isLogTab = currentTab === ConversationDetailsTabsValueEnum.LOG_TAB;
  const isActivityTab = currentTab === ConversationDetailsTabsValueEnum.ACTIVITY_TAB;
  return (
    <div className="flex w-[35%] flex-col items-start self-stretch border-b border-l border-t border-primary/10">
      {isSummaryTab ? <RightSideSummaryTabDisplayContent /> : null}
      {isLogTab ? <RightSideLogTabDisplayContent /> : null}
      {isActivityTab ? <RightSideActivityTabDisplayContent /> : null}
    </div>
  );
};

export default ConversationDetailsMultipleTabContainer;
