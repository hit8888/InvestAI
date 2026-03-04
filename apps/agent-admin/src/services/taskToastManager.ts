import { TaskStatus } from '@neuraltrade/core/types/admin/api';
import { taskPollingService } from './taskPollingService';
import LoadingToastMessage from '@breakout/design-system/components/layout/LoadingToastMessage';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';
import ErrorToastMessage from '@breakout/design-system/components/layout/ErrorToastMessage';
import { toast } from 'react-hot-toast';

class TaskToastManager {
  private loadingToastId: string | null = null;
  private activeTaskIds: Set<number> = new Set();
  private subscriptions: Map<number, () => void> = new Map();
  private suppressToasts = false;

  private handleManualDismiss = (toastId: string) => {
    if (this.loadingToastId !== toastId) {
      return;
    }
    this.suppressToasts = true;
    const taskIds = Array.from(this.activeTaskIds);
    taskIds.forEach((id) => {
      taskPollingService.stopPolling(id);
      this.stopManaging(id);
    });
    this.loadingToastId = null;
  };

  /**
   * Start managing toasts for a task
   */
  startManaging(taskId: number) {
    if (this.activeTaskIds.size === 0) {
      this.suppressToasts = false;
    }
    // Don't start if already managing
    if (this.subscriptions.has(taskId)) {
      return;
    }

    const getStatusMessage = (status: TaskStatus | null): string => {
      if (!status) return 'Re-running your request... Please hold on.';

      const { status: taskStatusValue, total_items, processed_items, success_count } = status;
      const remaining = total_items - processed_items;

      switch (taskStatusValue) {
        case 'PENDING':
          return 'Re-running your request... Please hold on.';
        case 'IN_PROGRESS':
          if (total_items > 0) {
            return `Processing ${processed_items} of ${total_items} items... ${remaining} remaining.`;
          }
          return 'Re-running your request... Please hold on.';
        case 'COMPLETED':
          return `Relevance score recalculation completed successfully. ${success_count} items processed.`;
        case 'FAILED':
          return 'Relevance score recalculation failed.';
        default:
          return 'Re-running your request... Please hold on.';
      }
    };

    // Subscribe to task status updates
    const unsubscribe = taskPollingService.subscribe(taskId, (status: TaskStatus) => {
      const message = getStatusMessage(status);

      if (status.status === 'COMPLETED') {
        this.stopManaging(taskId);
        if (!this.suppressToasts) {
          SuccessToastMessage({
            title: message,
            duration: 5000,
          });
        }
      } else if (status.status === 'FAILED') {
        this.stopManaging(taskId);
        if (!this.suppressToasts) {
          ErrorToastMessage({
            title: message,
            duration: 5000,
          });
        }
      } else if (status.status === 'PENDING' || status.status === 'IN_PROGRESS') {
        // Update or create loading toast (always track the latest toast id)
        this.activeTaskIds.add(taskId);
        if (this.suppressToasts) {
          return;
        }
        const newToastId = LoadingToastMessage({
          title: message,
          duration: Infinity, // Loading toasts should persist until dismissed
          toastId: this.loadingToastId ?? undefined,
          onDismiss: this.handleManualDismiss,
        });
        this.loadingToastId = newToastId;
      }
    });

    this.subscriptions.set(taskId, unsubscribe);

    // Show initial toast if task is already in progress
    const currentStatus = taskPollingService.getTaskStatus(taskId);
    if (currentStatus && (currentStatus.status === 'PENDING' || currentStatus.status === 'IN_PROGRESS')) {
      this.activeTaskIds.add(taskId);
      if (!this.suppressToasts) {
        const toastId = LoadingToastMessage({
          title: getStatusMessage(currentStatus),
          duration: Infinity,
          toastId: this.loadingToastId ?? undefined,
          onDismiss: this.handleManualDismiss,
        });
        this.loadingToastId = toastId;
      }
    }
  }

  /**
   * Stop managing toasts for a task
   */
  stopManaging(taskId: number) {
    const unsubscribe = this.subscriptions.get(taskId);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(taskId);
    }
    const wasActive = this.activeTaskIds.delete(taskId);
    if (wasActive && this.activeTaskIds.size === 0 && this.loadingToastId) {
      toast.dismiss(this.loadingToastId);
      this.loadingToastId = null;
    }
  }

  /**
   * Clean up all toast management
   */
  cleanup() {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.clear();
    if (this.loadingToastId) {
      toast.dismiss(this.loadingToastId);
      this.loadingToastId = null;
    }
    this.activeTaskIds.clear();
    this.suppressToasts = false;
  }
}

// Export singleton instance
export const taskToastManager = new TaskToastManager();
