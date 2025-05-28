import ResizeTextarea from '@breakout/design-system/components/TextArea/ResizeTextarea';
import { updateArtifact } from '@meaku/core/adminHttp/api';
import { useEffect, useState } from 'react';
import { CommonEditDrawerSectionProps } from '../utils';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { toast } from 'react-hot-toast';

type DescriptionSectionEditDrawerProps = Omit<CommonEditDrawerSectionProps, 'type'>;

const DescriptionSectionEditDrawer = ({ data, id, title, relevant_queries }: DescriptionSectionEditDrawerProps) => {
  const { updateSingleDataSource } = useDataSourceTableStore();
  const [description, setDescription] = useState(data);

  useEffect(() => {
    setDescription(data);
  }, [data]);

  const handleChange = (value: string) => {
    setDescription(value);
  };

  const handleBlur = async () => {
    // Skip if the value hasn't changed or is empty
    if (description.trim() === data.trim()) {
      return;
    }

    try {
      await updateArtifact(id, { title, data: description, relevant_queries });

      // Update the data source in the table store
      updateSingleDataSource(id, { data: description });
      toast.success('Your updates have been saved');
    } catch (err) {
      console.error('Error saving description:', err);
      toast.error('Error saving description');
    }
  };

  return (
    <div className="flex flex-1">
      <ResizeTextarea
        value={description}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add description for agent to train on it"
        className="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
      />
    </div>
  );
};
export default DescriptionSectionEditDrawer;
