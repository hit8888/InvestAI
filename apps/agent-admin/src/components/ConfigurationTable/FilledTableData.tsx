import Card from '../../components/AgentManagement/Card';
import Button from '@breakout/design-system/components/Button/index';
import { EditIcon } from 'lucide-react';
import { ConfigurationData } from './utils';
import Typography from '@breakout/design-system/components/Typography/index';
import Separator from '@breakout/design-system/components/layout/separator';

type FilledTableDataProps = {
  configurationData: ConfigurationData[];
  handleEdit: () => void;
};

const FilledTableData = ({ configurationData, handleEdit }: FilledTableDataProps) => {
  const visibilityRulesGrouped = configurationData.reduce(
    (acc, row) => {
      const visibilityRule = row.visibility_rules as string;
      if (!acc[visibilityRule]) {
        acc[visibilityRule] = [];
      }
      acc[visibilityRule].push(row as ConfigurationData);
      return acc;
    },
    {} as Record<string, ConfigurationData[]>,
  );

  // Create array with label and count for different rules present only
  const visibilityRulesArray = Object.entries(visibilityRulesGrouped)
    .filter(([rule, items]) => rule && rule.trim() !== '' && items.length > 0)
    .map(([rule, items]) => ({
      label: rule,
      count: items.length,
    }));

  return (
    <>
      <Card background={'WHITE'} border={'GRAY200'} className="p-4">
        {visibilityRulesArray.map((row, index) => (
          <VisibilityRulesWithCount
            key={row.label}
            addSeparator={index < visibilityRulesArray.length - 1}
            label={row.label}
            count={row.count}
          />
        ))}
      </Card>
      <div className="flex w-full justify-end">
        <Button variant="system_secondary" buttonStyle="rightIcon" rightIcon={<EditIcon />} onClick={handleEdit}>
          Edit
        </Button>
      </div>
    </>
  );
};

const VisibilityRulesWithCount = ({
  addSeparator,
  label,
  count,
}: {
  addSeparator: boolean;
  label: string;
  count: number;
}) => {
  const RuleCountLabel = count === 1 ? 'Rule' : 'Rules';
  const labelValue = label === 'exact' ? 'exact match' : label;
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <Typography variant="label-16-medium" className="flex-1 capitalize">
          {labelValue}
        </Typography>
        <Typography
          variant="caption-12-normal"
          className="flex items-center justify-center rounded-lg border border-bluegray-300 bg-bluegray-25 px-3 py-1 text-bluegray-1000"
        >
          {count} {RuleCountLabel}
        </Typography>
      </div>
      {addSeparator && <Separator className="w-full" />}
    </div>
  );
};

export default FilledTableData;
