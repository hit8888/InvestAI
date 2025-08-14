import WebSocketClient from '@meaku/core/networkClients/wsClient/wsClient';
import { ENV } from '@meaku/shared/constants/env';

export const wsClient = new WebSocketClient(`${ENV.VITE_BASE_WS_URL}/ws/chat`, {
  heartbeat: {
    interval: 60000,
  },
});
