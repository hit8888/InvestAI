import { WebSocket as ReconnectingWebSocket } from 'partysocket';
import type { QueuedMessage, HeartbeatConfig } from './types';

export class HealthCheckManager {
  private responseTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
  private heartbeatConfig: HeartbeatConfig | null = null;

  private readonly RESPONSE_TIMEOUT = 30000;
  private readonly MAX_RETRY_COUNT = 3;

  // Default heartbeat configuration
  private readonly DEFAULT_HEARTBEAT_CONFIG: HeartbeatConfig = {
    timeout: 10000, // 10 seconds timeout for pong response
    interval: 30000, // Send ping every 30 seconds
  };

  // Heartbeat methods
  initializeHeartbeat(options: HeartbeatConfig | undefined): void {
    // If no options provided, use defaults (heartbeat enabled by default)
    const config = {
      ...this.DEFAULT_HEARTBEAT_CONFIG,
      ...options,
    };

    // Allow disabling by setting interval to 0 or negative
    if (config.interval !== undefined && config.interval <= 0) {
      this.heartbeatConfig = null;
      return;
    }

    this.heartbeatConfig = config;
  }

  startHeartbeat(ws: ReconnectingWebSocket, onTimeout: () => void): void {
    // If no heartbeat config (disabled or not initialized), don't start heartbeat
    if (!this.heartbeatConfig) {
      return;
    }

    this.stopHeartbeat();

    const sendPing = (): void => {
      if (ws.readyState !== ReconnectingWebSocket.OPEN) return;

      try {
        ws.send('ping');

        // Set timeout for pong response
        this.heartbeatTimeoutTimer = setTimeout(() => {
          onTimeout();
        }, this.heartbeatConfig!.timeout);
      } catch (error) {
        console.error('Failed to send ping:', error);
      }
    };

    // Start the heartbeat interval
    this.heartbeatTimer = setInterval(sendPing, this.heartbeatConfig.interval);
  }

  stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  clearHeartbeatTimeout(): void {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  isHeartbeatAck(messageData: string): boolean {
    return messageData === 'pong';
  }

  // Response timeout methods
  startResponseTimeout(onTimeout: () => void): void {
    this.clearResponseTimeout();

    this.responseTimeout = setTimeout(() => {
      onTimeout();
    }, this.RESPONSE_TIMEOUT);
  }

  clearResponseTimeout(): void {
    if (this.responseTimeout) {
      clearTimeout(this.responseTimeout);
      this.responseTimeout = null;
    }
  }

  handleHealthTimeout(
    messages: QueuedMessage[],
    onReconnect: () => void,
    onMaxRetriesExceeded: () => void,
    onUpdateMessages: (messages: QueuedMessage[]) => void,
  ): void {
    if (!messages.length) return;

    console.warn(`Server unresponsive`);

    // Create new messages with incremented retry count (avoid mutation)
    const updatedMessages = messages.map((msg) => ({
      ...msg,
      retryCount: msg.retryCount + 1,
    }));

    const retryableMessages = updatedMessages.filter((msg) => msg.retryCount <= this.MAX_RETRY_COUNT);

    onUpdateMessages(retryableMessages);

    if (retryableMessages.length > 0) {
      console.log(`Reconnecting (${retryableMessages.length} messages remaining)`);
      onReconnect();
    } else {
      console.error(`Max retries exceeded - giving up`);
      onMaxRetriesExceeded();
    }
  }

  cleanup(): void {
    this.clearResponseTimeout();
    this.stopHeartbeat();
    this.heartbeatConfig = null;
  }
}
