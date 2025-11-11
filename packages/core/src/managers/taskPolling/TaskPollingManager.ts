import { TaskStatus } from '../../types/admin/api';

export class TaskPollingManager {
  private activeTasks: Map<number, TaskStatus> = new Map();

  addTask(taskId: number) {
    if (!this.activeTasks.has(taskId)) {
      const now = new Date().toISOString();
      this.activeTasks.set(taskId, {
        id: taskId,
        task_type: 'RELEVANCE_SCORE_RECALCULATION',
        status: 'PENDING',
        total_items: 0,
        processed_items: 0,
        success_count: 0,
        failure_count: 0,
        error_message: null,
        created_on: now,
        updated_on: now,
        created_by: 0,
        created_by_username: '',
        progress_percentage: 0,
      });
    }
  }

  updateTaskStatus(taskId: number, status: TaskStatus) {
    this.activeTasks.set(taskId, status);
  }

  removeTask(taskId: number) {
    this.activeTasks.delete(taskId);
  }

  getTaskStatus(taskId: number): TaskStatus | null {
    return this.activeTasks.get(taskId) ?? null;
  }

  isTaskActive(taskId: number): boolean {
    const status = this.activeTasks.get(taskId);
    return status ? status.status === 'PENDING' || status.status === 'IN_PROGRESS' : false;
  }

  getActiveTasks(): Record<number, TaskStatus> {
    return Object.fromEntries(this.activeTasks.entries());
  }

  clear() {
    this.activeTasks.clear();
  }
}

export const taskPollingManager = new TaskPollingManager();
