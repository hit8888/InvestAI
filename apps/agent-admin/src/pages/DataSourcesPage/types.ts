import { UseFormSetValue } from 'react-hook-form';

export type DisplayAndEditDataSourceDetailsSectionsProps = {
  title?: string;
  data?: string;
  type?: string;
  relevant_queries: string[];
  setValue: UseFormSetValue<{
    title: string;
    data: string;
    relevant_queries: string[];
  }>;
};
