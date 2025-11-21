import React from "react";
import { PanelTop, MousePointer2, Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";
import type {
  ChatMessage as ChatMessageType,
  NavigationPathItem,
  RouteStep,
} from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
  onNavigate?: (routes: RouteStep[]) => void;
  isNavigationDisabled?: boolean;
  navigate?: (path: string, options?: { state?: unknown }) => void;
  completedRouteIndices?: number[];
  isLastMessage?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onNavigate,
  isNavigationDisabled = false,
  navigate,
  completedRouteIndices = [],
  isLastMessage = false,
}) => {
  const isUser = message.role === "USER";
  const isAgent = message.role === "AGENT";

  const handleNavigate = () => {
    if (!message.routes || message.routes.length === 0) {
      return;
    }

    if (!navigate) {
      toast.error("Navigation function not available");
      return;
    }

    const routes = message.routes;
    const firstRoute = routes[0];

    if (!firstRoute.url) {
      toast.error("No URL found in the first route");
      return;
    }

    // Disable chat interface
    onNavigate?.(routes);

    // Navigate to first route with remaining routes in state
    const remainingRoutes = routes.slice(1);
    navigate(firstRoute.url, {
      state: {
        sevakRoutes: remainingRoutes,
        currentRouteIndex: 0,
        totalRoutes: routes.length,
      },
    });

    // Show toast with description
    if (firstRoute.description) {
      toast.success(firstRoute.description, {
        duration: 2000,
      });
    }
  };

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
      data-message-id={message.id}
      data-message-role={message.role}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-gray-800 text-white"
            : isAgent
              ? "bg-gray-100 text-gray-900"
              : "bg-gray-200 text-gray-800"
        }`}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Navigation path chips (for AGENT messages) - centered with arrows */}
        {isAgent &&
          message.navigationPath &&
          message.navigationPath.length > 0 && (
            <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 bg-white p-3 rounded-md">
              {message.navigationPath.map(
                (item: NavigationPathItem, index: number) => {
                  const navigationPath = message.navigationPath ?? [];
                  const isCompleted = completedRouteIndices.includes(index);
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm transition-all ${
                          isCompleted
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : item.type === "page"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 -my-2 text-green-600" />
                        ) : (
                          <>
                            {item.type === "page" && (
                              <PanelTop className="h-4 w-4 -my-2" />
                            )}
                            {item.type === "action" && (
                              <MousePointer2 className="h-4 w-4 -my-2" />
                            )}
                          </>
                        )}
                        <span>{item.label}</span>
                      </div>
                      {index < navigationPath.length - 1 && (
                        <svg
                          className="h-5 w-5 text-gray-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </React.Fragment>
                  );
                },
              )}
            </div>
          )}

        {/* CTA Button - only show for AGENT messages with routes if it's the last message */}
        {isAgent &&
          message.routes &&
          message.routes.length > 0 &&
          isLastMessage && (
            <button
              onClick={handleNavigate}
              disabled={isNavigationDisabled}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>help me do this</span>
            </button>
          )}
      </div>
    </div>
  );
};
