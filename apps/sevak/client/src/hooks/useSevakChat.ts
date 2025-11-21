import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ChatMessage,
  RoutingRequest,
  RoutingResponse,
  SevakClientConfig,
  ChatHistoryResponse,
} from "../types";

export interface UseSevakChatReturn {
  messages: ChatMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  sendMessage: (question: string) => void;
  clearMessages: () => void;
  reconnect: () => void;
}

export function useSevakChat(
  config: SevakClientConfig = {},
): UseSevakChatReturn {
  const {
    serverUrl = import.meta.env.VITE_SEVAK_SERVER_URL ||
      "http://localhost:7777",
    onMessage,
    onError,
    onConnect,
    onDisconnect,
  } = config;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messageIdCounter = useRef(0);
  const sessionIdRef = useRef<string | null>(null);
  const historyLoadedRef = useRef(false);

  // Get or create persistent session ID from localStorage
  const getSessionId = (): string => {
    const stored = localStorage.getItem("sevak-session-id");
    if (stored) {
      return stored;
    }
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sevak-session-id", newSessionId);
    return newSessionId;
  };

  const generateMessageId = () =>
    `msg-${Date.now()}-${++messageIdCounter.current}`;

  // Initialize socket connection
  useEffect(() => {
    const sessionId = getSessionId();
    sessionIdRef.current = sessionId;

    const socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        sessionId, // Send session ID in auth so server can use it
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      onConnect?.();
    });

    // Load chat history when server sends it
    socket.on("chat:history", (historyResponse: ChatHistoryResponse) => {
      if (
        historyResponse.messages &&
        historyResponse.messages.length > 0 &&
        !historyLoadedRef.current
      ) {
        historyLoadedRef.current = true;
        setMessages(historyResponse.messages);
        // Call onMessage for each historical message
        historyResponse.messages.forEach((msg) => {
          onMessage?.(msg);
        });
      }
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on("connect_error", (err) => {
      const error = new Error(`Connection error: ${err.message}`);
      setError(error);
      setIsConnected(false);
      onError?.(error);
    });

    socket.on("route:response", (response: RoutingResponse) => {
      setIsLoading(false);
      setError(null);

      const agentMessage: ChatMessage = {
        id: generateMessageId(),
        role: "AGENT",
        content: response.textResponse,
        timestamp: new Date().toISOString(),
        navigationPath: response.navigationPath,
        routes: response.routes,
        question: response.question,
      };

      // Message is already saved on server, just add to local state
      setMessages((prev) => [...prev, agentMessage]);
      onMessage?.(agentMessage);
    });

    socket.on(
      "route:error",
      (errorData: { error: string; details?: string }) => {
        setIsLoading(false);
        const error = new Error(errorData.error || "Unknown error");
        setError(error);
        onError?.(error);

        const errorMessage: ChatMessage = {
          id: generateMessageId(),
          role: "AGENT",
          content: `I apologize, but I encountered an error: ${errorData.error}. ${errorData.details || ""}`,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      },
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl, onMessage, onError, onConnect, onDisconnect]);

  const sendMessage = useCallback(
    (question: string) => {
      if (!question.trim() || !socketRef.current || !isConnected) {
        return;
      }

      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: generateMessageId(),
        role: "USER",
        content: question,
        timestamp: new Date().toISOString(),
        question,
      };

      setMessages((prev) => [...prev, userMessage]);
      onMessage?.(userMessage);

      // Send to server (user message will be saved server-side)
      const request: RoutingRequest = {
        question: question.trim(),
        role: "USER",
      };

      socketRef.current.emit("route:question", request);
    },
    [isConnected, onMessage],
  );

  const clearMessages = useCallback(() => {
    if (socketRef.current) {
      // Clear on server
      socketRef.current.emit("chat:clear");
    }
    // Clear local state immediately
    setMessages([]);
    historyLoadedRef.current = false;
  }, []);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current.connect();
    }
  }, []);

  return {
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    reconnect,
  };
}
