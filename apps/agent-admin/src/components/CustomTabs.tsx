import { Tabs, TabsList, TabsTrigger } from '@breakout/design-system/components/shadcn-ui/tabs';
import { cn } from '@breakout/design-system/lib/cn';

type CustomTabItem = {
  itemKey: string;
  itemValue: string;
  itemInfoTitle?: string;
  itemDescription?: string;
  itemTitle: string;
  itemIcon?: React.ReactNode;
};

type CustomTabsClasses = {
  container?: string;
  trigger?: string;
  triggerSelected?: string;
  triggerUnselected?: string;
};

type CustomTabsProps = {
  handleTabChange: (value: string) => void;
  tabItems: CustomTabItem[];
  tabDisabled?: boolean;
  renderTabInfo?: () => React.ReactNode;
  selectedTab: string;
  tabContainerClassName?: string;
  classes?: CustomTabsClasses;
};

const CustomTabs = ({
  handleTabChange,
  tabItems,
  tabDisabled,
  renderTabInfo,
  selectedTab,
  tabContainerClassName,
  classes = {},
}: CustomTabsProps) => {
  return (
    <Tabs value={selectedTab} className="flex w-full flex-col items-start gap-4" onValueChange={handleTabChange}>
      {renderTabInfo && renderTabInfo()}
      <TabsList className="w-full p-0">
        <div
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 p-2',
            tabContainerClassName,
            classes.container,
          )}
        >
          {tabItems.map((item) => (
            <TabsTrigger
              key={item.itemKey}
              value={item.itemValue}
              disabled={tabDisabled}
              className={cn('min-w-[200px] flex-1 rounded-full bg-gray-100 p-2 text-gray-500', classes.trigger, {
                'ring-offset bg-white text-gray-900 ring-1 ring-gray-200': selectedTab === item.itemValue,
                [classes.triggerSelected || '']: selectedTab === item.itemValue,
                [classes.triggerUnselected || '']: selectedTab !== item.itemValue,
              })}
            >
              {item.itemIcon && <span className="flex-shrink-0">{item.itemIcon}</span>}
              {item.itemTitle && <span>{item.itemTitle}</span>}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
    </Tabs>
  );
};

export default CustomTabs;
