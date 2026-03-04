import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import IncludedSourcesDialogHeader from './IncludedSourcesDialogHeader';
import Button from '@breakout/design-system/components/Button/index';
import { DataSourceItem } from '@neuraltrade/core/types/admin/api';
import { useDataSourcesStore } from '../../../stores/useDataSourcesStore';
import { useDataSources } from '../../../context/DataSourcesContext';
import DataSourceSingleItemDisplay from './DataSourceSingleItemDisplay';

interface CommonAddNewSourcesDataProps {
  data: (DataSourceItem | File)[];
  onDeleteAll: () => void;
}

const CommonAddNewSourcesData = ({ data, onDeleteAll }: CommonAddNewSourcesDataProps) => {
  const { selectedType } = useDataSources();
  const { removeDataSource } = useDataSourcesStore();

  return (
    <div className="flex w-full flex-col">
      <IncludedSourcesDialogHeader numberOfSources={data.length} handleDeleteAll={onDeleteAll} />
      <div className="flex max-h-72 min-h-64 w-full flex-col gap-4 overflow-y-auto px-6 py-2">
        {data.map((item) => (
          <div key={'id' in item ? item.id : item.name} className="flex w-full items-center gap-2 self-stretch">
            <DataSourceSingleItemDisplay item={item} sourceType={selectedType} />
            <Button
              variant={'destructive_tertiary'}
              buttonStyle={'icon'}
              onClick={() => removeDataSource('id' in item ? item.id : item.name)}
            >
              <DeleteIcon width="16" height="16" className="text-destructive-1000" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonAddNewSourcesData;
