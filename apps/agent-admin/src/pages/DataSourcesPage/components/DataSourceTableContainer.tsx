import DataSourceTableView from './DataSourceTableView';
import { useDataSources } from '../../../context/DataSourcesContext';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
const DataSourceTableContainer = () => {
  const { selectedType } = useDataSources();
  return (
    <div className="flex w-full flex-col items-end gap-6 self-stretch">
      <DataSourceTableView pageType={selectedType as PaginationPageType} />
    </div>
  );
};

export default DataSourceTableContainer;
