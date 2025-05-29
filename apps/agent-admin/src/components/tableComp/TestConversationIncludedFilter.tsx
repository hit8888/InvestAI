import { FilterType, PageTypeProps } from '@meaku/core/types/admin/filters';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { Switch } from '@breakout/design-system/components/layout/switch';

const TestConversationIncludedFilter = ({ page }: PageTypeProps) => {
  const { TestConversationIncluded } = FilterType;
  const filters = useAllFilterStore();
  const { testConversationsIncluded } = filters[page];

  const handleSwitchChange = () => {
    filters.setFilter(page, TestConversationIncluded, !testConversationsIncluded);
  };

  return (
    <div
      onClick={handleSwitchChange}
      className="flex w-full cursor-pointer self-stretch bg-white p-4 
    hover:bg-primary/5 focus:border-2 focus:border-primary focus:bg-primary/5 focus:outline-none focus:ring-offset-0"
    >
      <p className="flex-1 text-base font-normal text-gray-900">Test Conversations</p>
      <div className="flex items-center gap-2 text-gray-500">
        <Switch
          checked={testConversationsIncluded}
          onCheckedChange={handleSwitchChange}
          className="transition-colors data-[state=unchecked]:border-gray-200 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default TestConversationIncludedFilter;
