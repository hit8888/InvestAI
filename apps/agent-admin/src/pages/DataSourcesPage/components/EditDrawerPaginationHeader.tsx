import Button from '@breakout/design-system/components/Button/index';
import { XIcon } from 'lucide-react';
import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import PaginationNextArrow from '@breakout/design-system/components/icons/pagination-next-arrow';
import PaginationPreviousArrow from '@breakout/design-system/components/icons/pagination-previous-arrow';

type EditDrawerPaginationHeaderProps = {
  onClose: () => void;
  selectedDataSources: CommonDataSourceResponse[];
  paginationState: {
    itemIndex: number;
    handleNextItem: () => void;
    handlePreviousItem: () => void;
    isFirstItem: boolean;
    isLastItem: boolean;
  };
};

const EditDrawerPaginationHeader = ({
  selectedDataSources,
  onClose,
  paginationState,
}: EditDrawerPaginationHeaderProps) => {
  const totalItems = selectedDataSources.length;
  const { itemIndex, handleNextItem, handlePreviousItem, isFirstItem, isLastItem } = paginationState;

  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-200 p-4">
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-row items-center gap-8">
          <Button
            disabled={isFirstItem}
            className="border-gray-200 bg-gray-25"
            variant="system_secondary"
            buttonStyle="icon"
            onClick={handlePreviousItem}
          >
            <PaginationPreviousArrow className="h-4 w-4 text-system" />
          </Button>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{itemIndex + 1}</span> of {totalItems}
          </p>
          <Button
            disabled={isLastItem}
            className="border-gray-200 bg-gray-25"
            variant="system_secondary"
            buttonStyle="icon"
            onClick={handleNextItem}
          >
            <PaginationNextArrow className="h-4 w-4 text-system" />
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button variant="system_tertiary" buttonStyle="icon" onClick={onClose}>
          <XIcon className="h-6 w-6 text-system" />
        </Button>
      </div>
    </div>
  );
};

export default EditDrawerPaginationHeader;
