import React, { useMemo, useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';
import Input from '@breakout/design-system/components/layout/input';
import { FilterType, CommonFilterContentProps } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getDescendingOrderedOptions } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { useTableStore } from '../../stores/useTableStore';
import { useQueryOptions } from '../../hooks/useQueryOptions';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import FilterOptionsShimmer from '../ShimmerComponent/FilterOptionsShimmer';

const LocationFilterContent = ({ page, filterState, handleClosePopover }: CommonFilterContentProps) => {
  const tableManager = useTableStore((state) => state.tableManager);
  const filters = useAllFilterStore();
  const { Location } = FilterType;
  const [searchTerm, setSearchTerm] = useState('');

  const filtersOptionsPayload = useMemo(() => {
    return getAllFilterAppliedValues(filters[page], page).filter((filter) => filter.field !== 'country');
  }, [filters[page], page]);

  const payloadData: FilterOptionsPayload = {
    filters: filtersOptionsPayload,
    field: 'country',
    search: searchTerm,
  };

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: debouncedPayloadData,
    page: page,
    queryOptions,
  });

  const sortedCountries: string[] = tableManager?.getSortedItemsByKey('country') ?? [];
  const locationValues: string[] = data?.values.filter(Boolean) ?? [];

  const resultantOptions = getDescendingOrderedOptions(sortedCountries, locationValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const hasSearchTermLength = searchTerm.length > 0;

  if (isLoading) return <FilterOptionsShimmer checkboxOrientation="right" isFlagShimmer={true} />;
  if (isError) return <div>No Location data</div>;
  if (!data) return null;
  return (
    <React.Fragment key={Location}>
      <div className="px-4">
        <div className="flex">
          <Input
            className="w-full min-w-[300px] rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
            onChange={handleInputChange}
            value={searchTerm}
            maxLength={20}
            placeholder="Enter Country Name..."
          />
          {hasSearchTermLength ? (
            <button
              type="button"
              aria-label="clear button"
              className="relative right-8 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center"
              onClick={clearSearchTerm}
            >
              <CrossIcon width={'20'} height={'20'} className="text-primary" />
            </button>
          ) : null}
        </div>
      </div>
      <CommonCheckboxesFilterContent
        filterState={filterState}
        handleClosePopover={handleClosePopover}
        keyValue={Location}
        checkboxOptions={resultantOptions || []}
        isLocationFilter={true}
        checkboxOrientation={'right'}
        selectedOptions={filters[page].location}
        onSelectionChange={(value) => filters.setFilter(page, Location, value)}
      />
    </React.Fragment>
  );
};

export default LocationFilterContent;
