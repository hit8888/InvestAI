import { useForm, UseFormSetValue, Control } from 'react-hook-form';
import { useEffect } from 'react';

export interface DataSourceFormData {
  title: string;
  data: string;
  relevant_queries: string[];
}

interface UseDataSourceFormProps {
  title: string;
  data: string;
  relevant_queries: string[];
  defaultTitle?: string;
  defaultData?: string;
}

interface UseDataSourceFormReturn {
  watchedValues: DataSourceFormData;
  setValue: UseFormSetValue<DataSourceFormData>;
  reset: (data?: Partial<DataSourceFormData>) => void;
  hasFormContentChanged: () => boolean;
  handleAddQuestion: () => void;
  padRelevantQueries: (queries: string[]) => string[];
  isDirty: boolean;
  control: Control<DataSourceFormData>;
}

export const useDataSourceForm = ({
  title,
  data,
  relevant_queries,
  defaultTitle = '',
  defaultData = '',
}: UseDataSourceFormProps): UseDataSourceFormReturn => {
  const padRelevantQueries = (queries: string[]) => {
    const minLength = 4;
    if (queries.length >= minLength) {
      return queries;
    }
    return [...queries, ...Array(minLength - queries.length).fill('')];
  };

  const {
    watch,
    setValue,
    reset,
    control,
    formState: { isDirty },
  } = useForm<DataSourceFormData>({
    defaultValues: {
      title: title || defaultTitle,
      data: data || defaultData,
      relevant_queries: padRelevantQueries(relevant_queries),
    },
  });

  // Watch the form values
  const watchedValues = watch();

  // Update form values when data source changes
  useEffect(() => {
    reset({
      title: title || defaultTitle,
      data: data || defaultData,
      relevant_queries: padRelevantQueries(relevant_queries),
    });
  }, [title, data, relevant_queries, reset, defaultTitle, defaultData]);

  // Custom dirty check for form fields since RHF's isDirty might not detect array changes properly
  const hasFormContentChanged = () => {
    const originalQueries = relevant_queries.filter((q: string) => q.trim() !== '');
    const currentQueries = watchedValues.relevant_queries.filter((q: string) => q.trim() !== '');
    return (
      JSON.stringify(originalQueries) !== JSON.stringify(currentQueries) ||
      JSON.stringify(data) !== JSON.stringify(watchedValues.data) ||
      JSON.stringify(title) !== JSON.stringify(watchedValues.title)
    );
  };

  const handleAddQuestion = () => {
    const lastQuestion = watchedValues.relevant_queries[watchedValues.relevant_queries.length - 1];
    if (lastQuestion && lastQuestion.trim() !== '') {
      const newQueries = [...watchedValues.relevant_queries, ''];
      setValue('relevant_queries', newQueries);

      // Scroll to the end of the container after adding the new question
      setTimeout(() => {
        const container = document.getElementById('datasource-container') as HTMLElement;
        if (container) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

          // Focus the newly added input after scrolling
          setTimeout(() => {
            const newInputIndex = newQueries.length - 1;
            const newInput = document.querySelector(`[data-question-index="${newInputIndex}"]`) as HTMLInputElement;
            if (newInput) {
              newInput.focus();
            }
          }, 300);
        }
      }, 100);
    }
  };

  return {
    watchedValues,
    setValue,
    reset,
    hasFormContentChanged,
    handleAddQuestion,
    padRelevantQueries,
    isDirty,
    control,
  };
};
