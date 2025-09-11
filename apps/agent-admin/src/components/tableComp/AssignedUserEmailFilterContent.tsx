import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@meaku/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { useFilterContent } from '../../hooks/useFilterContent';

const AssignedUserEmailFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { AssignedUserEmail } = FilterType;

  const { filters, setFilter, resultantOptions, isLoading, isError } = useFilterContent({
    page,
    field: 'assigned_user_email',
    enableSearch: false,
  });

  if (isLoading)
    return <FilterOptionsShimmer checkboxOrientation="left" isSearchInputShimmer={false} isSelectAllShimmer={false} />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500"> No Email data</p>;

  return (
    <CommonCheckboxesFilterContent
      filterState={filterState}
      keyValue={AssignedUserEmail}
      checkboxOptions={resultantOptions ?? []}
      selectedOptions={filters.assignedUserEmail}
      onSelectionChange={(value) => setFilter(page, AssignedUserEmail, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default AssignedUserEmailFilterContent;
