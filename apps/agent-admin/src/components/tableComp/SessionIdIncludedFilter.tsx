import { FilterType, PageTypeProps } from '@meaku/core/types/admin/filters';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import { Switch } from '@breakout/design-system/components/layout/switch';

const SessionIdIncludedFilter = ({ page }: PageTypeProps) => {
  const { SessionIdIncluded } = FilterType;
  const filters = useAllFilterStore();
  const { sessionIdIncluded } = filters[page];

  const handleSwitchChange = () => {
    filters.setFilter(page, SessionIdIncluded, !sessionIdIncluded);
  };

  return (
    <div
      onClick={handleSwitchChange}
      className="flex w-full cursor-pointer self-stretch bg-white p-4 
    hover:bg-primary/5 focus:border-2 focus:border-primary focus:bg-primary/5 focus:outline-none focus:ring-offset-0"
    >
      <p className="flex-1 text-base font-normal text-gray-900">Conversations</p>
      <div className="flex items-center gap-2 text-gray-500">
        <Switch
          checked={sessionIdIncluded}
          onCheckedChange={handleSwitchChange}
          className="transition-colors data-[state=unchecked]:border-gray-200 data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default SessionIdIncludedFilter;
