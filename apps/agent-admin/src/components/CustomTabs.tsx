import { Tabs, TabsList, TabsTrigger } from '@breakout/design-system/components/shadcn-ui/tabs';
import { cn } from '@breakout/design-system/lib/cn';

type CustomTabItem = {
  itemKey: string;
  itemValue: string;
  itemInfoTitle?: string;
  itemDescription?: string;
  itemTitle: string;
};

type CustomTabsProps = {
  handleTabChange: (value: string) => void;
  tabItems: CustomTabItem[];
  tabDisabled?: boolean;
  renderTabInfo?: () => React.ReactNode;
  selectedTab: string;
  tabContainerClassName?: string;
};

const CustomTabs = ({
  handleTabChange,
  tabItems,
  tabDisabled,
  renderTabInfo,
  selectedTab,
  tabContainerClassName,
}: CustomTabsProps) => {
  return (
    <Tabs value={selectedTab} className="flex flex-col items-start gap-4" onValueChange={handleTabChange}>
      {renderTabInfo && renderTabInfo()}
      <TabsList className="w-full p-0">
        <div
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-full bg-gray-100 p-2',
            tabContainerClassName,
          )}
        >
          {tabItems.map((item) => (
            <TabsTrigger
              key={item.itemKey}
              value={item.itemValue}
              disabled={tabDisabled}
              className={cn('min-w-[200px] flex-1 rounded-full bg-gray-100 p-2 text-gray-500', {
                'ring-offset bg-white text-gray-900 ring-1 ring-gray-200': selectedTab === item.itemValue,
              })}
            >
              {item.itemTitle}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
    </Tabs>
  );
};

export default CustomTabs;
