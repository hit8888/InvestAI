import DataSourceTableView from './DataSourceTableView';
import { useDataSources } from '../../../context/DataSourcesContext';
import { PaginationPageType } from '@neuraltrade/core/types/admin/admin';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import EditBulkRowItemsDrawer from './EditBulkRowItemsDrawer';
import { useDataSourcesDrawer } from '../../../context/DataSourcesDrawerContext';
import { DOCUMENTS_PAGE } from '@neuraltrade/core/utils/index';
import CustomDocumentDrawer from './CustomDocumentDrawer';

const DataSourceTableContainer = () => {
  const { selectedType } = useDataSources();
  const { deselectAll } = useDataSourceTableStore();
  const { isDataSourcesDrawerOpen, toggleDataSourcesDrawer } = useDataSourcesDrawer();

  const handleCloseDrawer = () => {
    toggleDataSourcesDrawer(false);
    deselectAll();
  };

  const isDocumentsPage = selectedType === DOCUMENTS_PAGE;

  return (
    <div className="flex w-full flex-col items-end gap-6 self-stretch">
      <DataSourceTableView pageType={selectedType as PaginationPageType} />
      {isDocumentsPage ? (
        <CustomDocumentDrawer
          isClickedOnCreateButton={false}
          open={isDataSourcesDrawerOpen}
          onClose={handleCloseDrawer}
        />
      ) : (
        <EditBulkRowItemsDrawer open={isDataSourcesDrawerOpen} onClose={handleCloseDrawer} />
      )}
    </div>
  );
};

export default DataSourceTableContainer;
