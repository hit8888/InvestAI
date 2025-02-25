import React, { Component, ErrorInfo } from 'react';
import { trackError } from '@meaku/core/utils/error';

interface Props {
  children: React.ReactNode;
  messageId: string;
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
        messageId: this.props.messageId,
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
              <h3 className="text-sm font-medium text-red-800">Error displaying message</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Something went wrong while displaying this message. The error has been reported.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MessageItemErrorBoundary;
