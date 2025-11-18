import { Search } from 'lucide-react';
import React from 'react';
import Input from '../layout/input';
import CrossIcon from '@breakout/design-system/components/icons/cross-icon';

type DropdownMenuSearchProps = {
  searchTerm: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearchTerm: () => void;
  placeholder?: string;
};

const DropdownMenuSearch = React.memo(
  ({ searchTerm, handleInputChange, clearSearchTerm, placeholder = 'Search fonts' }: DropdownMenuSearchProps) => {
    const hasSearchTermLength = searchTerm.length > 0;

    return (
      <div className="relative w-full border-b border-gray-200 p-4">
        <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          autoFocus
          placeholder={placeholder}
          className="w-full border-gray-300 bg-gray-50 pl-10 placeholder:text-gray-400 focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            // Prevent the dropdown menu's roving focus/typeahead logic from stealing focus
            event.stopPropagation();
          }}
        />
        {hasSearchTermLength ? (
          <button
            type="button"
            aria-label="clear button"
            className="absolute right-6 top-5 flex h-6 w-6 cursor-pointer items-center justify-center"
            onClick={clearSearchTerm}
          >
            <CrossIcon width={'20'} height={'20'} className="text-system" />
          </button>
        ) : null}
      </div>
    );
  },
);

DropdownMenuSearch.displayName = 'DropdownMenuSearch';

export default DropdownMenuSearch;
