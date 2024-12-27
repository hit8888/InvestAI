import AllFiltersIcon from '@breakout/design-system/components/icons/all-filters';

const AllFilters = () => {
  return (
    <div className="flex items-center gap-1 self-stretch rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2">
      <AllFiltersIcon />
      <p className="font-inter text-[14px] font-medium leading-[20px] text-[#4E46DC]">All Filters</p>
    </div>
  );
};

export default AllFilters;
