import { nanoid } from 'nanoid';
import { MessageRole, MessageEventType, type Message } from '../types/message';
import { DeviceType } from '@neuraltrade/core/types/common';

export const getUserMessage = (message: string, overrides?: Partial<Message>): Partial<Message> => {
  const { event_type, event_data, response_id, ...safeOverrides } = overrides ?? {};

  return {
    response_id: response_id ?? nanoid(),
    role: MessageRole.USER,
    event_type: event_type ?? MessageEventType.TEXT_REQUEST,
    event_data: event_data ?? { content: message },
    timestamp: new Date().toISOString(),
    is_admin: false,
    device_type: DeviceType.DESKTOP,
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
