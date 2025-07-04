import { MessageViewType } from '@meaku/core/types/common';

export const getChatTextMessageContainerClass = (messageViewType: MessageViewType): string => {
  switch (messageViewType) {
    case MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW:
    case MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW:
      return 'mr-16 justify-start pl-2';
    case MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW:
    case MessageViewType.USER_MESSAGE_IN_USER_VIEW:
    case MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW:
      return 'ml-16 justify-end pr-2';
    default:
      return '';
  }
};

export const getDiscoveryAnswerContainerClass = (messageViewType: MessageViewType): string => {
  switch (messageViewType) {
    case MessageViewType.USER_MESSAGE_IN_USER_VIEW:
      return 'ml-16 justify-end';
    case MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW:
      return 'mr-16';
    default:
      return '';
  }
};

export const getChatMessageClass = (messageViewType: MessageViewType) => {
  switch (messageViewType) {
    case MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW:
    case MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW:
      return 'flex flex-col gap-1 bg-gray-100 py-2 px-4';
    case MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW:
    case MessageViewType.USER_MESSAGE_IN_USER_VIEW:
      return 'bg-transparent_gray_6 py-2 px-4';
    default:
      return '';
  }
};
