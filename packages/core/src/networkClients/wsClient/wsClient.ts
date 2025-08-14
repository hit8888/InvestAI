import { WebSocket as ReconnectingWebSocket } from 'partysocket';
import type { WSClientOptions, ReadyState } from './types';
import { HealthCheckManager } from './wsClient.healthCheck';
import { MessageQueueManager } from './wsClient.messageQueue';
import { InterceptorManager } from './wsClient.interceptor';
import type { QueuedMessage } from './types';

class WebSocketClient {
  private baseUrl: string;
  private options: WSClientOptions;
  private ws: ReconnectingWebSocket | null = null;
  private healthCheckManager: HealthCheckManager;
  private messageQueueManager: MessageQueueManager;
  private interceptorManager: InterceptorManager;

  constructor(baseUrl: string, options: WSClientOptions = {}) {
    this.baseUrl = baseUrl;
    this.options = options;
    this.healthCheckManager = new HealthCheckManager();
    this.messageQueueManager = new MessageQueueManager();
    this.interceptorManager = new InterceptorManager();
  }

  // Private methods
  private handleHealthTimeout = (): void => {
    const messages = this.messageQueueManager.getMessages();

    this.healthCheckManager.handleHealthTimeout(
      messages,
      this.handleReconnect,
      this.handleCleanup,
      this.handleUpdateMessages,
    );
  };

  private handleHeartbeatTimeout = (): void => {
    console.warn(`Heartbeat timeout: ${this.baseUrl}`);
    this.reconnect();
  };

  private handleReconnect = (): void => {
    this.reconnect();
  };

  private handleCleanup = (): void => {
    this.cleanup();
  };

  private handleUpdateMessages = (msgs: QueuedMessage[]): void => {
    this.messageQueueManager.setMessages(msgs);
  };

  private cleanup(): void {
    this.messageQueueManager.cleanup();
    this.healthCheckManager.cleanup();
    this.interceptorManager.cleanup();
  }

  private buildUrl(queryParams?: Record<string, string | number | boolean>): string {
    if (!queryParams || Object.keys(queryParams).length === 0) return this.baseUrl;

    try {
      const url = new URL(this.baseUrl);
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
      return url.toString();
    } catch {
      throw new Error(`WebSocketClient: Invalid URL - ${this.baseUrl}`);
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.addEventListener('message', (event) => {
      const isHeartbeatAck = this.healthCheckManager.isHeartbeatAck(event.data);

      if (isHeartbeatAck) {
        this.healthCheckManager.clearHeartbeatTimeout();
        return;
      }

      this.healthCheckManager.clearResponseTimeout();
      this.messageQueueManager.clearMessages();
    });

    this.ws.addEventListener('open', () => {
      if (!this.ws) return;

      const messages = this.messageQueueManager.getMessages();

      messages.forEach((msg) => {
        const finalMessage = this.interceptorManager.applyInterceptor(msg.content);
        this.ws!.send(finalMessage);
      });

      console.log(`Sent ${messages.length} queued messages for ${this.baseUrl}`);
      this.healthCheckManager.startResponseTimeout(this.handleHealthTimeout);
      this.healthCheckManager.startHeartbeat(this.ws, this.handleHeartbeatTimeout);
    });

    this.ws.addEventListener('close', (event) => {
      this.healthCheckManager.stopHeartbeat();
      console.log(`WebSocket closed: ${this.baseUrl} (${event.code})`);
    });

    this.ws.addEventListener('error', (error) => {
      console.error(`WebSocket error: ${this.baseUrl}`, error);
    });
  }

  // Public methods
  connect(options?: WSClientOptions): void {
    if (this.ws) return;

    this.options = { ...this.options, ...options };

    const finalUrl = this.buildUrl(this.options.queryParams);
    const ws = new ReconnectingWebSocket(finalUrl, [], this.options.reconnectionOptions);
    this.ws = ws;

    if (!ws) {
      throw new Error(`WebSocketClient: Failed to create WebSocket connection for ${finalUrl}`);
    }

    this.interceptorManager.setInterceptor(this.options.interceptor);
    this.healthCheckManager.initializeHeartbeat(this.options.heartbeat);
    this.setupEventListeners();
  }

  send(message: string): void {
    this.messageQueueManager.addMessage(message);

    if (!this.ws || this.ws.readyState !== ReconnectingWebSocket.OPEN) return;

    const finalMessage = this.interceptorManager.applyInterceptor(message);
    this.ws.send(finalMessage);
    this.healthCheckManager.startResponseTimeout(this.handleHealthTimeout);
  }

  disconnect(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  reconnect(): void {
    if (!this.ws) return;
    this.ws.reconnect();
  }

  getSocket(): ReconnectingWebSocket | null {
    return this.ws;
  }

  getReadyState(): ReadyState {
    return this.ws ? this.ws.readyState : ReconnectingWebSocket.CLOSED;
  }
}

export { ReadyState };
export default WebSocketClient;
