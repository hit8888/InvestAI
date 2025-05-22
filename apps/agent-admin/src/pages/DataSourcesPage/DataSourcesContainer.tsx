import { DataSourcesProvider } from '../../context/DataSourcesContext';
import DataSourcesPage from './DataSourcesPage';

const DataSourcesContainer = () => {
  return (
    <DataSourcesProvider>
      <DataSourcesPage />
    </DataSourcesProvider>
  );
};

export default DataSourcesContainer;
