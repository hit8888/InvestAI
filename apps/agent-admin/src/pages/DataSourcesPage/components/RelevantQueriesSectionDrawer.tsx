import Input from '@breakout/design-system/components/layout/input';
import Typography from '@breakout/design-system/components/Typography/index';
import { updateArtifact } from '@meaku/core/adminHttp/api';
import { useEffect, useState } from 'react';
import { CommonEditDrawerSectionProps } from '../utils';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { toast } from 'react-hot-toast';

const getTypeText = (type: string) => {
  if (type === 'VIDEO') return 'video';
  if (type === 'DOCUMENT') return 'text';
  if (type === 'SLIDE') return 'slide';
  return '';
};

type RelevantQueriesSectionDrawerProps = CommonEditDrawerSectionProps & {
  onCallBack?: (relevant_queries: string[]) => void;
};

const RelevantQueriesSectionDrawer = ({
  type,
  relevant_queries,
  id,
  title,
  data,
  onCallBack,
}: RelevantQueriesSectionDrawerProps) => {
  const initiateQueries = () => {
    if (relevant_queries.length >= 4) {
      return relevant_queries;
    }
    return [...relevant_queries, ...Array(4 - relevant_queries.length).fill('')];
  };

  const { updateSingleDataSource } = useDataSourceTableStore();
  const [queries, setQueries] = useState<string[]>(() => initiateQueries());

  useEffect(() => {
    const newQueries = initiateQueries();
    setQueries(newQueries);
  }, [relevant_queries]);

  const handleQueryChange = (index: number, value: string) => {
    const newQueries = [...queries];
    newQueries[index] = value;
    setQueries(newQueries);
  };

  const handleBlur = async (index: number) => {
    const currentValue = queries[index];

    // Skip if the value hasn't changed or is empty
    if (currentValue === relevant_queries[index]) {
      return;
    }

    const newRelevantQueries = queries.filter((item) => item.trim().length > 0);

    try {
      if (onCallBack) {
        onCallBack(newRelevantQueries);
        return;
      }
      await updateArtifact(id, { title, data, relevant_queries: newRelevantQueries });

      // Update the data source in the table store
      updateSingleDataSource(id, { relevant_queries: newRelevantQueries });
      toast.success('Your updates have been saved');
    } catch (err) {
      console.error('Error saving query:', err);
      toast.error('Error saving query');
    }
  };

  const typeText = getTypeText(type);

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Typography
        variant="label-16-medium"
        textColor="black"
      >{`Add sample questions matching the ${typeText}`}</Typography>
      <div className="grid w-full grid-cols-2 gap-4">
        {queries.map((query, index) => (
          <Input
            key={index}
            value={query}
            onChange={(e) => handleQueryChange(index, e.target.value)}
            onBlur={() => handleBlur(index)}
            placeholder={`Question ${index + 1}`}
            className="h-11 w-full rounded-lg focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
          />
        ))}
      </div>
    </div>
  );
};

export default RelevantQueriesSectionDrawer;
