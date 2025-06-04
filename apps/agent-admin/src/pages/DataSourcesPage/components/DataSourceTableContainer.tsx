import DataSourceTableView from './DataSourceTableView';
import { useDataSources } from '../../../context/DataSourcesContext';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import EditBulkRowItemsDrawer from './EditBulkRowItemsDrawer';
import { useDataSourcesDrawer } from '../../../context/DataSourcesDrawerContext';

const DataSourceTableContainer = () => {
  const { selectedType } = useDataSources();
  const { deselectAll } = useDataSourceTableStore();
  const { isDataSourcesDrawerOpen, toggleDataSourcesDrawer } = useDataSourcesDrawer();

  const handleCloseDrawer = () => {
    toggleDataSourcesDrawer(false);
    deselectAll();
  };

  return (
    <div className="flex w-full flex-col items-end gap-6 self-stretch">
      <DataSourceTableView pageType={selectedType as PaginationPageType} />
      <EditBulkRowItemsDrawer open={isDataSourcesDrawerOpen} onClose={handleCloseDrawer} />
    </div>
  );
};

export default DataSourceTableContainer;
