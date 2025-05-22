import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { useDataSources } from '../../../context/DataSourcesContext';
import { getIncludedSourceLabel } from '../utils';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';

type IProps = {
  numberOfSources: number;
  handleDeleteAll: () => void;
};

const IncludedSourcesDialogHeader = ({ numberOfSources, handleDeleteAll }: IProps) => {
  const { selectedType } = useDataSources();
  const { label, icon: Icon } = getIncludedSourceLabel(selectedType);
  return (
    <div className="flex w-full flex-col items-start self-stretch p-6 pb-4">
      <div className="flex w-full items-center gap-2.5 self-stretch">
        <div className="flex flex-1 items-center gap-4">
          <Typography variant={'title-18'} textColor={'textPrimary'}>
            {`Included ${label}`}
          </Typography>
          <div className="flex items-center justify-center gap-2 rounded-custom-50 bg-gray-200 py-1 pl-2 pr-3">
            <Icon width="16" height="" className="text-gray-500" />
            <Typography>{`${numberOfSources} ${label}`}</Typography>
          </div>
        </div>
        <Button onClick={handleDeleteAll} variant={'destructive_secondary'} buttonStyle={'rightIcon'}>
          Delete All
          <DeleteIcon width="16" height="16" className="text-destructive-1000" />
        </Button>
      </div>
    </div>
  );
};

export default IncludedSourcesDialogHeader;
