import InfoCard from '../../components/AgentManagement/InfoCard';
import Button from '@breakout/design-system/components/Button/index';
import { Check, EditIcon } from 'lucide-react';
import { SUPPORT_CONFIG } from './utils';

type IProps = {
  supportData: Record<string, string>;
  handleEdit: () => void;
};
const FilledSupportData = ({ supportData, handleEdit }: IProps) => {
  return (
    <>
      {SUPPORT_CONFIG.filter((item) => supportData[item.id]).map((item, index) => (
        <InfoCard
          icon={Check}
          key={`original-support-${index}-${item.id}`}
          title={item.label}
          description={supportData[item.id]}
        />
      ))}
      <div className="flex w-full justify-end">
        <Button variant="system_secondary" buttonStyle="rightIcon" rightIcon={<EditIcon />} onClick={handleEdit}>
          Edit
        </Button>
      </div>
    </>
  );
};

export default FilledSupportData;
