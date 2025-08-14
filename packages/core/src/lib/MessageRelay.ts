type MessageMetadata = Record<string, unknown> & {
  forwardToTransport?: boolean; // Defaults to true, controls whether message should be forwarded to transport
};

type BaseMessage<T = unknown> = {
  payload: T;
  meta: MessageMetadata; // Used for metadata related purposes
};

type MessageHandler<T = unknown> = (msg: BaseMessage<T>) => void;

type MessageRule<T = unknown> = {
  predicate: (msg: BaseMessage<T>) => boolean;
  handler: MessageHandler<T>;
};

/**
 * A generic message routing and relay system for handling typed message communication
 * between different modules and external transport layers.
 *
 * MessageRelay acts as a central hub that:
 * - Routes incoming messages to appropriate handlers based on predicates
 * - Manages message flow between internal modules and external transport
 * - Provides type-safe message handling with generic payload support
 * - Enables configurable message forwarding behavior
 *
 * @template T - The type of message payload (defaults to unknown)
 *
 * @example
 * ```typescript
 * // Create a relay for chat messages
 * const chatRelay = new MessageRelay<ChatMessage>();
 *
 * // Register a handler for specific message types
 * chatRelay.register({
 *   predicate: (msg) => msg.payload.type === 'user_message',
 *   handler: (msg) => console.log('User message:', msg.payload.text)
 * });
 *
 * // Attach transport for external communication
 * chatRelay.attachTransportSender((msg) => websocket.send(msg));
 *
 * // Process incoming messages from transport
 * chatRelay.processMessage({ payload: message, meta: {} });
 *
 * // Send messages to both handlers and transport
 * chatRelay.sendMessage({ payload: response, meta: { forwardToTransport: true } });
 * ```
 */
class MessageRelay<T = unknown> {
  private handlers: MessageRule<T>[] = [];
  private sendToTransport: (msg: BaseMessage<T>) => void = () => {
    console.warn('No transport attached to MessageRelay');
  };

  register(rule: MessageRule<T>) {
    this.handlers.push(rule);
  }

  registerMany(rules: MessageRule<T>[]) {
    this.handlers.push(...rules);
  }

  processMessage(msg: BaseMessage<T>) {
    this.handlers.forEach(({ predicate, handler }) => {
      try {
        if (predicate(msg)) {
          handler(msg);
        }
      } catch (error) {
        console.error('Error in MessageRelay handler execution:', error);
      }
    });
  }

  processMessages(msgs: BaseMessage<T>[]) {
    msgs.forEach((msg) => this.processMessage(msg));
  }

  sendMessage(msg: BaseMessage<T>) {
    this.processMessage(msg);

    const shouldForward = msg.meta.forwardToTransport !== false;
    if (shouldForward) {
      this.sendToTransport(msg);
    }
  }

  sendMessages(msgs: BaseMessage<T>[]) {
    msgs.forEach((msg) => this.sendMessage(msg));
  }

  attachTransportSender(senderFn: (msg: BaseMessage<T>) => void) {
    this.sendToTransport = senderFn;
  }
}

export type { BaseMessage, MessageHandler, MessageRule, MessageMetadata };
export default MessageRelay;
