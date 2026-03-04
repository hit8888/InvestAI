import { useEffect, useState } from 'react';
import { TaskStatus } from '@neuraltrade/core/types/admin/api';
import { taskPollingService } from '../services/taskPollingService';

/**
 * Hook to subscribe to task status polling.
 * Polling continues even when component unmounts.
 * @param taskId - The task ID to poll for
 * @param enabled - Whether to enable polling (default: true)
 * @returns Task status and polling state
 */
export const useTaskStatusPolling = (taskId: number | null, enabled: boolean = true) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  useEffect(() => {
    if (!taskId || !enabled) {
      setTaskStatus(null);
      setIsPolling(false);
      return;
    }

    // Start polling (this will continue even if component unmounts)
    taskPollingService.startPolling(taskId);

    // Subscribe to updates
    const unsubscribe = taskPollingService.subscribe(taskId, (status) => {
      setTaskStatus(status);
    });

    // Initialize polling state
    setIsPolling(taskPollingService.isPolling(taskId));

    // Subscribe to polling state changes
    const unsubscribePollingState = taskPollingService.onPollingStateChange(() => {
      setIsPolling(taskPollingService.isPolling(taskId));
    });

    // Get initial status if available
    const initialStatus = taskPollingService.getTaskStatus(taskId);
    if (initialStatus) {
      setTaskStatus(initialStatus);
    }

    // Cleanup subscription (but don't stop polling)
    return () => {
      unsubscribe();
      unsubscribePollingState();
    };
  }, [taskId, enabled]);

  return { taskStatus, isPolling };
};
