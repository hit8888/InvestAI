import Card from '../../components/AgentManagement/Card';
import InfoCard from '../../components/AgentManagement/InfoCard';
import Button from '@breakout/design-system/components/Button/index';
import { EditIcon } from 'lucide-react';
import { ProductDescriptionData } from './utils';

type IProps = {
  productDescriptions: ProductDescriptionData[];
  handleEdit: () => void;
};

const FilledProductDescriptionData = ({ productDescriptions, handleEdit }: IProps) => {
  return (
    <Card background={'GRAY25'} border={'GRAY200'}>
      {productDescriptions.map((product, index) => (
        <InfoCard
          key={`original-product-${index}-${product.name}`}
          title={product.name}
          description={product.description}
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

export default FilledProductDescriptionData;
