import { WebSocket as ReconnectingWebSocket } from 'partysocket';
import { Options } from 'partysocket/ws';

export interface HeartbeatConfig {
  timeout?: number; // Timeout for pong response (default: 10000ms)
  interval?: number; // Interval between ping messages (default: 30000ms)
}

export type WSClientOptions = {
  heartbeat?: HeartbeatConfig;
  interceptor?: (message: string) => string; // Modify message before sending to server
  reconnectionOptions?: Options;
  queryParams?: Record<string, string | number | boolean>;
};

export type QueuedMessage = {
  content: string;
  retryCount: number;
};

export enum ReadyState {
  CONNECTING = ReconnectingWebSocket.CONNECTING,
  OPEN = ReconnectingWebSocket.OPEN,
  CLOSING = ReconnectingWebSocket.CLOSING,
  CLOSED = ReconnectingWebSocket.CLOSED,
}
