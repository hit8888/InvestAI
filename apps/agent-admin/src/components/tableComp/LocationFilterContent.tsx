import React, { useMemo, useState } from 'react';
import { useAllFilterStore } from '../../stores/useAllFilterStore';
import CommonCheckboxesFilterContent from './CommonCheckboxesFilterContent';
import Input from '@breakout/design-system/components/layout/input';
import { PageTypeProps } from '../../utils/admin-types';
import { FilterType } from '@meaku/core/types/admin/filters';
import { FilterOptionsPayload } from '@meaku/core/types/admin/api';
import { getAllFilterAppliedValues, getTenantFromLocalStorage } from '../../utils/common';
import useFilterOptionsDataQuery from '../../queries/query/useFilterOptionsDataQuery';
import { keepPreviousData } from '@tanstack/react-query';

const LocationFilterContent = ({ page, handleClosePopover }: PageTypeProps & { handleClosePopover: () => void }) => {
  const tenantName = getTenantFromLocalStorage();
  const filters = useAllFilterStore();
  const { Location } = FilterType;
  const [searchTerm, setSearchTerm] = useState('');

  const payloadData: FilterOptionsPayload = {
    filters: getAllFilterAppliedValues(filters[page], page),
    field: 'country',
    search: searchTerm,
  };

  const { data, isLoading, isError } = useFilterOptionsDataQuery({
    payload: payloadData,
    tenantName: tenantName || '',
    page: page,
    queryOptions: {
      enabled: !!tenantName,
      placeholderData: keepPreviousData,
    },
  });
  // console.log("location options data", data)
  const locationOptions = useMemo(
    () =>
      data?.values.filter(Boolean).map((value) => ({
        value: value,
        label: value,
      })) || [],
    [data?.values],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (!data) return null;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>No Location data</div>;
  return (
    <React.Fragment key={Location}>
      <div className="border-b border-gray-300 px-4 pb-4">
        <Input
          className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
          onChange={handleInputChange}
          value={searchTerm}
          placeholder="Enter Country Name..."
        />
      </div>
      <CommonCheckboxesFilterContent
        handleClosePopover={handleClosePopover}
        keyValue={Location}
        checkboxOptions={locationOptions || []}
        isLocationFilter={true}
        selectedOptions={filters[page].location}
        onSelectionChange={(value) => filters.setFilter(page, Location, value)}
      />
    </React.Fragment>
  );
};

export default LocationFilterContent;
