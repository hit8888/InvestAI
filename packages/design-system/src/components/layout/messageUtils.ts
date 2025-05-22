import { MessageViewType } from '@meaku/core/types/common';

export const getChatTextMessageContainerClass = (messageViewType: MessageViewType): string => {
  switch (messageViewType) {
    case MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW:
    case MessageViewType.USER_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.USER_MESSAGE_IN_DASHBOARD_VIEW:
      return 'mr-16 py-4 pl-2';
    case MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW:
    case MessageViewType.USER_MESSAGE_IN_USER_VIEW:
      return 'ml-16 justify-end py-4 pr-2';
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
      return 'bg-gray-100';
    case MessageViewType.ADMIN_MESSAGE_IN_ADMIN_VIEW:
    case MessageViewType.ADMIN_MESSAGE_IN_DASHBOARD_VIEW:
    case MessageViewType.USER_MESSAGE_IN_USER_VIEW:
      return 'bg-transparent_gray_6';
    default:
      return '';
  }
};
