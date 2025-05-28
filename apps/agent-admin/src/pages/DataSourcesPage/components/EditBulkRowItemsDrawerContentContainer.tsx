import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import EditDrawerPaginationHeader from './EditDrawerPaginationHeader';
import useDataSourceEditDrawerPagination from '../../../hooks/useDataSourceEditDrawerPagination';
import DisplayAndEditDataSourceDetails from './DisplayAndEditDataSourceDetails';

type EditBulkRowItemsDrawerContentContainerProps = {
  onClose: () => void;
};

const EditBulkRowItemsDrawerContentContainer = ({ onClose }: EditBulkRowItemsDrawerContentContainerProps) => {
  const { getSelectedDataSources } = useDataSourceTableStore();
  const selectedDataSources = getSelectedDataSources();
  const paginationState = useDataSourceEditDrawerPagination(selectedDataSources.length);

  return (
    <div className="flex flex-col gap-4">
      <EditDrawerPaginationHeader
        selectedDataSources={selectedDataSources}
        onClose={onClose}
        paginationState={paginationState}
      />
      <DisplayAndEditDataSourceDetails selectedDataSources={selectedDataSources} paginationState={paginationState} />
    </div>
  );
};

export default EditBulkRowItemsDrawerContentContainer;
