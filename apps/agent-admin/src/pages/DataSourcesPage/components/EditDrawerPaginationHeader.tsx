import Button from '@breakout/design-system/components/Button/index';
import { XIcon } from 'lucide-react';
import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import PaginationNextArrow from '@breakout/design-system/components/icons/pagination-next-arrow';
import PaginationPreviousArrow from '@breakout/design-system/components/icons/pagination-previous-arrow';
import PaginationArrowButton from '../../../components/tableComp/PaginationArrowButton';

type EditDrawerPaginationHeaderProps = {
  onClose: () => void;
  items: CommonDataSourceResponse[];
  paginationState: {
    itemIndex: number;
    handleNextItem: () => void;
    handlePreviousItem: () => void;
    isFirstItem: boolean;
    isLastItem: boolean;
  };
};

const EditDrawerPaginationHeader = ({ items, onClose, paginationState }: EditDrawerPaginationHeaderProps) => {
  const totalItems = items.length;
  const { itemIndex, handleNextItem, handlePreviousItem, isFirstItem, isLastItem } = paginationState;

  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-200 p-4">
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-row items-center gap-8">
          <PaginationArrowButton
            isDisabled={isFirstItem}
            onButtonClick={handlePreviousItem}
            PaginationArrow={PaginationPreviousArrow}
          />
          <p className="text-sm text-gray-500">
            <span className="font-semibold">{itemIndex + 1}</span> of {totalItems}
          </p>
          <PaginationArrowButton
            isDisabled={isLastItem}
            onButtonClick={handleNextItem}
            PaginationArrow={PaginationNextArrow}
          />
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
