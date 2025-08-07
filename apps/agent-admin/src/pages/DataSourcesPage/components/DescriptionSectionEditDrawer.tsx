import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import { DisplayAndEditDataSourceDetailsSectionsProps } from '../types';

const DescriptionSectionEditDrawer = ({ data, setValue }: DisplayAndEditDataSourceDetailsSectionsProps) => {
  const handleChange = (value: string) => {
    setValue('data', value);
  };

  return (
    <div className="flex flex-1">
      <ResizeTextarea
        value={data || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add description for agent to train on it"
        className="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
      />
    </div>
  );
};
export default DescriptionSectionEditDrawer;
