import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import { CommonFilterContentProps, FilterType } from '@neuraltrade/core/types/admin/filters';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';
import { SdrAssignment } from '@neuraltrade/core/types/admin/api';
import { useFilterContent } from '../../hooks/useFilterContent';
import { useTableStore } from '../../stores/useTableStore';
import { useMemo } from 'react';
import { VisitorsTableViewContent } from '@neuraltrade/core/types/admin/admin';

const SdrAssignmentFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const { SdrAssignment } = FilterType;
  const { filters, setFilter, resultantOptions, isLoading, isError, data } = useFilterContent({
    page,
    field: 'sdr_assignment',
  });

  const tableManager = useTableStore((state) => state.tableManager);

  const sdrAssignmentOptions = useMemo(() => {
    if (!tableManager) return [];

    const tableData = tableManager.getTableDataResults();
    const sdrAssignmentMap = new Map<number, SdrAssignment>();
    const sdrIds = data?.values.filter(Boolean).map(Number) ?? [];

    // Collect unique SdrAssignment objects by ID
    tableData.forEach((item: VisitorsTableViewContent) => {
      const sdrAssignment = item.sdr_assignment as SdrAssignment;
      if (sdrAssignment && sdrAssignment.id && sdrAssignment.assigned_user && sdrIds.includes(sdrAssignment.id)) {
        sdrAssignmentMap.set(sdrAssignment.id, sdrAssignment);
      }
    });

    // Convert to checkbox options format
    return Array.from(sdrAssignmentMap.values());
  }, [tableManager, data?.values]);

  if (isLoading)
    return <FilterOptionsShimmer checkboxOrientation="left" isSearchInputShimmer={false} isSelectAllShimmer={false} />;
  if (isError || !resultantOptions.length)
    return <p className="p-4 text-center text-sm text-gray-500">No Assigned Rep data</p>;

  return (
    <CommonCheckboxesFilterContent
      filterState={filterState}
      keyValue={SdrAssignment}
      checkboxOptions={sdrAssignmentOptions ?? []}
      selectedOptions={filters.sdrAssignment}
      onSelectionChange={(value) => setFilter(page, SdrAssignment, value)}
      handleClosePopover={handleClosePopover}
    />
  );
};

export default SdrAssignmentFilterContent;
