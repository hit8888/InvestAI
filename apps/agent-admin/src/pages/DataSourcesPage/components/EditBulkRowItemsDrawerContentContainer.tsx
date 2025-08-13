import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import EditDrawerPaginationHeader from './EditDrawerPaginationHeader';
import useDataSourceEditDrawerPagination from '../../../hooks/useDataSourceEditDrawerPagination';
import DisplayAndEditDataSourceDetails from './DisplayAndEditDataSourceDetails';

type EditBulkRowItemsDrawerContentContainerProps = {
  onClose: () => void;
};

const EditBulkRowItemsDrawerContentContainer = ({ onClose }: EditBulkRowItemsDrawerContentContainerProps) => {
  const { results, getSelectedIds } = useDataSourceTableStore();
  const selectedIds = getSelectedIds();

  const selectedItems = selectedIds
    .map((id) => results.find((item) => item.id === id))
    .filter((item) => item !== undefined);
  const paginatedItems = selectedItems.length > 1 ? selectedItems : results;

  const activeItemIndex = paginatedItems.findIndex((item) => selectedIds.includes(item.id));
  const paginationState = useDataSourceEditDrawerPagination(activeItemIndex, paginatedItems.length);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <EditDrawerPaginationHeader items={paginatedItems} onClose={onClose} paginationState={paginationState} />
      <DisplayAndEditDataSourceDetails selectedDataSources={paginatedItems} paginationState={paginationState} />
    </div>
  );
};

export default EditBulkRowItemsDrawerContentContainer;
