import React, { Component, ErrorInfo } from 'react';
import { trackError } from '@neuraltrade/core/utils/error';
import Typography from '../../Typography';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';

interface Props {
  children: React.ReactNode;
  message: WebSocketMessage;
}

interface State {
  hasError: boolean;
}

class MessageItemErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    trackError(error, {
      component: 'MessageItem',
      action: 'render',
      additionalData: {
        message: this.props.message,
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <Typography variant="label-14-medium" textColor="error">
                Error displaying message
              </Typography>
              <Typography className="mt-2" variant="body-14" textColor="error600">
                Something went wrong while displaying this message. The error has been reported.
              </Typography>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MessageItemErrorBoundary;
