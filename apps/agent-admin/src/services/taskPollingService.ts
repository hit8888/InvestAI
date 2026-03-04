import { getTaskStatus } from '@neuraltrade/core/adminHttp/api';
import { taskPollingManager } from '@neuraltrade/core/managers/taskPolling/TaskPollingManager';
import { TaskStatus } from '@neuraltrade/core/types/admin/api';

const POLLING_INTERVAL_MS = 3000; // Poll every 3 seconds

class TaskPollingService {
  private intervals: Map<number, NodeJS.Timeout> = new Map();
  private subscribers: Map<number, Set<(status: TaskStatus) => void>> = new Map();
  private pollingStateListeners: Set<() => void> = new Set();

  private notifyPollingStateChange() {
    this.pollingStateListeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error('Error in polling state listener:', error);
      }
    });
  }

  /**
   * Start polling for a task. Polling will continue even if components unmount.
   */
  startPolling(taskId: number) {
    // Don't start if already polling
    if (this.intervals.has(taskId)) {
      return;
    }

    // Add task to manager
    taskPollingManager.addTask(taskId);

    const pollTaskStatus = async () => {
      try {
        const response = await getTaskStatus(taskId);
        const data = response.data;

        // Cast status to the correct type
        const status: TaskStatus = {
          ...data,
          status: data.status as TaskStatus['status'],
        };

        // Update manager
        taskPollingManager.updateTaskStatus(taskId, status);

        // Notify subscribers
        this.notifySubscribers(taskId, status);

        // Stop polling if task is completed or failed
        if (status.status === 'COMPLETED' || status.status === 'FAILED') {
          this.stopPolling(taskId);
        }
      } catch (error) {
        console.error('Error polling task status:', error);
        const existingStatus = taskPollingManager.getTaskStatus(taskId);
        const failedStatus: TaskStatus = {
          id: taskId,
          task_type: existingStatus?.task_type || 'UNKNOWN',
          status: 'FAILED',
          total_items: existingStatus?.total_items || 0,
          processed_items: existingStatus?.processed_items || 0,
          success_count: existingStatus?.success_count || 0,
          failure_count: existingStatus?.failure_count || 1,
          error_message: 'Failed to fetch task status',
          created_on: existingStatus?.created_on || new Date().toISOString(),
          updated_on: new Date().toISOString(),
          created_by: existingStatus?.created_by || 0,
          created_by_username: existingStatus?.created_by_username || '',
          progress_percentage: existingStatus?.progress_percentage || 0,
        };

        taskPollingManager.updateTaskStatus(taskId, failedStatus);
        this.notifySubscribers(taskId, failedStatus);
        this.stopPolling(taskId);
      }
    };

    // Initial poll
    pollTaskStatus();

    // Set up interval for subsequent polls
    const interval = setInterval(pollTaskStatus, POLLING_INTERVAL_MS);
    this.intervals.set(taskId, interval);
    this.notifyPollingStateChange();
  }

  /**
   * Stop polling for a task
   */
  stopPolling(taskId: number) {
    const interval = this.intervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
      this.notifyPollingStateChange();
    }
    // Don't remove from store - keep status for components to read
  }

  /**
   * Subscribe to task status updates
   */
  subscribe(taskId: number, callback: (status: TaskStatus) => void): () => void {
    if (!this.subscribers.has(taskId)) {
      this.subscribers.set(taskId, new Set());
    }
    this.subscribers.get(taskId)!.add(callback);

    // Immediately call with current status if available
    const currentStatus = taskPollingManager.getTaskStatus(taskId);
    if (currentStatus) {
      callback(currentStatus);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(taskId);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(taskId);
        }
      }
    };
  }

  /**
   * Notify all subscribers of a task status update
   */
  private notifySubscribers(taskId: number, status: TaskStatus) {
    const subscribers = this.subscribers.get(taskId);
    if (subscribers) {
      subscribers.forEach((callback) => {
        try {
          callback(status);
        } catch (error) {
          console.error('Error in task status subscriber:', error);
        }
      });
    }
  }

  /**
   * Check if a task is currently being polled
   */
  isPolling(taskId: number): boolean {
    return this.intervals.has(taskId);
  }

  /**
   * Get current task status from store
   */
  getTaskStatus(taskId: number): TaskStatus | null {
    return taskPollingManager.getTaskStatus(taskId);
  }

  /**
   * Clean up all polling (useful for testing or app shutdown)
   */
  cleanup() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    this.subscribers.clear();
    this.notifyPollingStateChange();
  }

  /**
   * Subscribe to polling state changes (start/stop)
   */
  onPollingStateChange(listener: () => void) {
    this.pollingStateListeners.add(listener);
    return () => {
      this.pollingStateListeners.delete(listener);
    };
  }
}

// Export singleton instance
export const taskPollingService = new TaskPollingService();
