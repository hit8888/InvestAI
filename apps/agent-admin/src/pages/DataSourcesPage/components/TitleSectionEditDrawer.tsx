import Input from '@breakout/design-system/components/layout/input';
import { updateArtifact } from '@meaku/core/adminHttp/api';
import { useState, useEffect } from 'react';
import { CommonEditDrawerSectionProps } from '../utils';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import toast from 'react-hot-toast';

type TitleSectionEditDrawerProps = Omit<CommonEditDrawerSectionProps, 'type'>;

const TitleSectionEditDrawer = ({ title, id, data, relevant_queries }: TitleSectionEditDrawerProps) => {
  const { updateSingleDataSource } = useDataSourceTableStore();
  const [titleValue, setTitleValue] = useState(title);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  const handleBlur = async () => {
    // Skip if the value hasn't changed or is empty
    if (titleValue.trim() === title.trim()) {
      return;
    }

    try {
      await updateArtifact(id, { title: titleValue, data, relevant_queries });

      // Update the data source in the table store
      updateSingleDataSource(id, { title: titleValue });
      toast.success('Your updates have been saved');
    } catch (err) {
      console.error('Error saving title:', err);
      toast.error('Error saving title');
    }
  };

  return (
    <Input
      value={titleValue}
      onChange={(e) => setTitleValue(e.target.value)}
      onBlur={handleBlur}
      placeholder="Add title"
      className="rounded-lg border-gray-300 focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
    />
  );
};

export default TitleSectionEditDrawer;
