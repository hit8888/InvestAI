const MESSAGE_TYPE = "TAB_NOTIFICATION";
const ACTION_SET_NOTIFICATION_TITLE = "SET_NOTIFICATION_TITLE";
const ACTION_RESET_NOTIFICATION_TITLE = "RESET_NOTIFICATION_TITLE";
const ACTION_PARENT_VISIBILITY_CHANGE = "PARENT_VISIBILITY_CHANGE";

type NotificationMessage = {
  type: typeof MESSAGE_TYPE;
  action: string;
  title?: string;
  initialTitle?: string;
};

type TabNotificationManagerOptions = {
  postMessage?: (message: object) => void;
};

function TabNotificationManager() {
  // Options
  let postMessage: ((message: object) => void) | null = null;

  // State
  const initialTitle: string = document.title;
  let visibilityHandler: (() => void) | null = null;
  let messageHandler: ((event: MessageEvent) => void) | null = null;

  // Private functions
  function handleTitleChange(title?: string): void {
    if (!title) return;
    document.title = title;
  }

  function notifyVisibilityChange(hidden: boolean): void {
    postMessage?.({
      type: MESSAGE_TYPE,
      action: ACTION_PARENT_VISIBILITY_CHANGE,
      hidden,
      initialTitle,
    });
  }

  function setupMessageListener(): void {
    messageHandler = (event: MessageEvent) => {
      if (!event.data || event.data.type !== MESSAGE_TYPE) return;

      const data = event.data as NotificationMessage;

      if (data.action === ACTION_SET_NOTIFICATION_TITLE) {
        handleTitleChange(data.title);
      }

      if (data.action === ACTION_RESET_NOTIFICATION_TITLE) {
        handleTitleChange(initialTitle);
      }
    };

    window.addEventListener("message", messageHandler);
  }

  function setupVisibilityListener(): void {
    visibilityHandler = () => {
      notifyVisibilityChange(document.hidden);
    };

    document.addEventListener("visibilitychange", visibilityHandler);

    // Initial notification
    notifyVisibilityChange(document.hidden);
  }

  // Public API
  function init(options: TabNotificationManagerOptions = {}): void {
    postMessage = options.postMessage ?? postMessage;

    setupMessageListener();
    setupVisibilityListener();
  }

  return {
    init,
  };
}

export { TabNotificationManager };
