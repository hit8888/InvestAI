import {
  ConversationDetailsTabsLabelEnum,
  ConversationDetailsTabsValueEnum,
  STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE,
} from '../../utils/constants';
import SingleTabDisplay from './SingleTabDisplay';

// import ActivityTabIcon from '@breakout/design-system/components/icons/activity-tab-icon';
import SummaryTabIcon from '@breakout/design-system/components/icons/summary-tab-icon';
import LogTabIcon from '@breakout/design-system/components/icons/log-tab-icon';
import { cn } from '@breakout/design-system/lib/cn';
import SummaryTabDisplayContent from './SummaryTabDisplayContent';
import LogTabDisplayContent from './LogTabDisplayContent';
import MultipleClickableTabShimmer from '../ShimmerComponent/MultipleClickableTabShimmer';
// import ActivityTabDisplayContent from './ActivityTabDisplayContent';

type IProps = {
  currentTab: ConversationDetailsTabsValueEnum;
  handleTabClick: (value: ConversationDetailsTabsValueEnum) => void;
  isLoading: boolean;
};

type TabConfig = {
  value: ConversationDetailsTabsValueEnum;
  label: string;
  icon: React.ElementType; // Icon component type
  content: React.ReactNode; // Tab content
  isActive: boolean; // To determine if the tab is active or not
};

const MultipleTabSelectContainer = ({ currentTab, handleTabClick, isLoading }: IProps) => {
  const {
    SUMMARY_TAB,
    LOG_TAB,
    // ACTIVITY_TAB
  } = ConversationDetailsTabsValueEnum;
  const {
    SUMMARY_TAB_LABEL,
    LOG_TAB_LABEL,
    // ACTIVITY_TAB_LABEL
  } = ConversationDetailsTabsLabelEnum;

  const tabs: TabConfig[] = [
    {
      value: SUMMARY_TAB,
      label: SUMMARY_TAB_LABEL,
      icon: SummaryTabIcon,
      content: <SummaryTabDisplayContent isLoading={isLoading} />,
      isActive: currentTab === SUMMARY_TAB,
    },
    {
      value: LOG_TAB,
      label: LOG_TAB_LABEL,
      icon: LogTabIcon,
      content: <LogTabDisplayContent />,
      isActive: currentTab === LOG_TAB,
    },
    // {
    //   value: ACTIVITY_TAB,
    //   label: ACTIVITY_TAB_LABEL,
    //   icon: ActivityTabIcon,
    //   content: <ActivityTabDisplayContent />,
    //   isActive: currentTab === ACTIVITY_TAB,
    // },
  ];

  return (
    <div className="flex max-w-[70%] flex-1 flex-col items-start self-stretch">
      <div
        className={cn([
          'sticky z-10 flex items-start self-stretch border-b border-primary/10 bg-white pt-4',
          isLoading && 'border-b-0',
        ])}
        style={{
          top: `${STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE}px`,
        }}
      >
        {isLoading ? (
          <MultipleClickableTabShimmer tabsLength={tabs.length} />
        ) : (
          tabs.map(({ value, label, icon: Icon, isActive }) => (
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
                  'text-white': isActive,
                  'text-primary': !isActive,
                })}
              />
            </SingleTabDisplay>
          ))
        )}
      </div>
      {tabs.map(
        ({ content, isActive, value }) =>
          isActive && (
            <div className="w-full" key={value}>
              {content}
            </div>
          ),
      )}
    </div>
  );
};

export default MultipleTabSelectContainer;
