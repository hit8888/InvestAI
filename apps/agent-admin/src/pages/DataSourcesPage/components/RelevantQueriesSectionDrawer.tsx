import Input from '@breakout/design-system/components/layout/input';
import Typography from '@breakout/design-system/components/Typography/index';
import { Trash2Icon } from 'lucide-react';
import { DisplayAndEditDataSourceDetailsSectionsProps } from '../types';
import { cn } from '@breakout/design-system/lib/cn';

const getTypeText = (type: string) => {
  if (type === 'VIDEO') return 'video';
  if (type === 'DOCUMENT') return 'text';
  if (type === 'SLIDE') return 'slide';
  return '';
};

const RelevantQueriesSectionDrawer = ({
  type,
  relevant_queries,
  setValue,
}: DisplayAndEditDataSourceDetailsSectionsProps) => {
  const handleQueryChange = (index: number, value: string) => {
    setValue(`relevant_queries.${index}`, value);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQueries = relevant_queries.filter((_, i) => i !== index);

    // If the array will have less than 4 items after deletion, add empty strings to maintain minimum 4
    if (newQueries.length < 4) {
      while (newQueries.length < 4) {
        newQueries.push('');
      }
    }

    setValue('relevant_queries', newQueries);
  };

  const typeText = getTypeText(type || '');

  return (
    <div className="flex flex-1 flex-col gap-2">
      <Typography
        variant="label-16-medium"
        textColor="black"
      >{`Add sample questions matching the ${typeText}`}</Typography>
      <div className="grid w-full grid-cols-2 gap-4">
        {relevant_queries.map((query: string, index: number) => (
          <div key={index} className="relative">
            <Input
              value={query}
              onChange={(e) => handleQueryChange(index, e.target.value)}
              placeholder={`Question ${index + 1}`}
              className="h-11 w-full rounded-lg pr-10 focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
              data-question-index={index}
            />
            <button
              onClick={() => handleDeleteQuestion(index)}
              className={cn('absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-500', { hidden: !query.length })}
              title="Delete question"
            >
              <Trash2Icon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelevantQueriesSectionDrawer;
