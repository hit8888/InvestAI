import Card from '../../components/AgentManagement/Card';
import InfoCard from '../../components/AgentManagement/InfoCard';
import Button from '@breakout/design-system/components/Button/index';
import { EditIcon } from 'lucide-react';
import { ConfigurationData, ColumnConfig } from './utils';

type FilledTableDataProps = {
  configurationData: ConfigurationData[];
  handleEdit: () => void;
  columns: ColumnConfig[];
  displayKeys?: string[]; // Specify which keys to display in the card (defaults to first 2 columns)
};

const FilledTableData = ({ configurationData, handleEdit, columns, displayKeys }: FilledTableDataProps) => {
  // Determine which keys to display - default to first two columns
  const keysToDisplay = displayKeys || columns.slice(0, 2).map((col) => col.key);
  const titleKey = keysToDisplay[0] || columns[0]?.key || 'name';
  const descriptionKey = keysToDisplay[1] || columns[1]?.key || 'description';

  return (
    <Card background={'GRAY25'} border={'GRAY200'}>
      {configurationData.map((row, index) => (
        <InfoCard
          key={`config-row-${index}-${row[titleKey]}`}
          title={row[titleKey] || ''}
          description={row[descriptionKey] || ''}
        />
      ))}
      <div className="flex w-full justify-end">
        <Button variant="primary" buttonStyle="rightIcon" rightIcon={<EditIcon />} onClick={handleEdit}>
          Edit
        </Button>
      </div>
    </Card>
  );
};

export default FilledTableData;
