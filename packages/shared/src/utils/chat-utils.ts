import { nanoid } from 'nanoid';
import { MessageRole, MessageEventType, type Message } from '../types/message';

export const getUserMessage = (message: string, overrides?: Partial<Message>): Partial<Message> => {
  const { event_type, event_data, ...safeOverrides } = overrides ?? {};

  return {
    response_id: overrides?.response_id ?? nanoid(),
    role: MessageRole.USER,
    event_type: event_type ?? MessageEventType.TEXT_REQUEST,
    event_data: event_data ?? { content: message },
    timestamp: new Date().toISOString(),
    ...safeOverrides,
  } as Partial<Message>;
};

export const getInputType = (dataType: string) => {
  switch (dataType) {
    case 'email':
    case 'business_email':
      return 'email';
    case 'datetime':
      return 'datetime-local';
    case 'date':
      return 'date';
    case 'int':
      return 'number';
    default:
      return 'text';
  }
};
