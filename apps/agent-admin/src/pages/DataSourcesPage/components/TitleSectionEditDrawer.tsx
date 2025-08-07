import Input from '@breakout/design-system/components/layout/input';
import { DisplayAndEditDataSourceDetailsSectionsProps } from '../types';

const TitleSectionEditDrawer = ({ title, setValue }: DisplayAndEditDataSourceDetailsSectionsProps) => {
  const handleChange = (value: string) => {
    setValue('title', value);
  };

  return (
    <div className="h-11">
      <Input
        value={title || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add title"
        className="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
      />
    </div>
  );
};

export default TitleSectionEditDrawer;
