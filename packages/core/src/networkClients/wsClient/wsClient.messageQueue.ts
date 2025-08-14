import type { QueuedMessage } from './types';

export class MessageQueueManager {
  private messageQueue: QueuedMessage[] = [];

  addMessage(content: string): void {
    this.messageQueue.push({
      content,
      retryCount: 0,
    });
  }

  getQueuedMessageCount(): number {
    return this.messageQueue.length;
  }

  getMessages(): QueuedMessage[] {
    return this.messageQueue;
  }

  clearMessages(): void {
    this.messageQueue.length = 0;
  }

  setMessages(messages: QueuedMessage[]): void {
    this.messageQueue = messages;
  }

  cleanup(): void {
    this.clearMessages();
  }
}
