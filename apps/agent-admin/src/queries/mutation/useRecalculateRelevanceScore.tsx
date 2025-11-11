import { useMutation } from '@tanstack/react-query';
import { recalculateRelevanceScore } from '@meaku/core/adminHttp/api';
import { AxiosResponse } from 'axios';

export interface RecalculateRelevanceScoreResponse {
  task_id: number;
  workflow_id: string;
  message: string;
  task: {
    id: number;
    task_type: string;
    status: string;
    total_items: number;
    processed_items: number;
    success_count: number;
    failure_count: number;
    error_message: string | null;
    created_on: string;
    updated_on: string;
    created_by: number;
    created_by_username: string;
    progress_percentage: number;
  };
}

const recalculateRelevanceScoreRequest = async (): Promise<RecalculateRelevanceScoreResponse> => {
  const response: AxiosResponse<RecalculateRelevanceScoreResponse> = await recalculateRelevanceScore();
  return response.data;
};

export const useRecalculateRelevanceScore = () => {
  return useMutation({
    mutationFn: recalculateRelevanceScoreRequest,
  });
};
