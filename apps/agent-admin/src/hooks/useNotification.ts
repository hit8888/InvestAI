import { useState, useEffect, useCallback, useMemo } from 'react';

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  onClick?: () => void;
  onError?: (error: Event) => void;
}

export interface UseNotificationReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  showNotification: (options: NotificationOptions) => Notification | null;
  isPermissionGranted: boolean;
}

const isSupported = 'Notification' in window;

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isSupported) {
    console.error('This browser does not support notifications');
    return 'denied';
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

export const useNotification = (): UseNotificationReturn => {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    isSupported ? Notification.permission : 'denied',
  );

  const showNotification = useCallback(
    (options: NotificationOptions): Notification | null => {
      if (!isSupported) {
        console.error('This browser does not support notifications');
        return null;
      }

      if (permission !== 'granted') {
        console.error('Notification permission is not granted');
        return null;
      }

      try {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          badge: options.badge,
          tag: options.tag,
          requireInteraction: options.requireInteraction,
          silent: options.silent,
        });

        if (options.onClick) {
          notification.onclick = () => {
            options.onClick?.();
            window.focus();
            notification.close();
          };
        }

        if (options.onError) {
          notification.onerror = options.onError;
        }

        return notification;
      } catch (error) {
        console.error('Error showing notification:', error);
        return null;
      }
    },
    [permission],
  );

  useEffect(() => {
    if (isSupported && permission === 'default') {
      requestNotificationPermission().then(setPermission);
    }

    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => ({
      permission,
      isSupported,
      showNotification,
      isPermissionGranted: permission === 'granted',
    }),
    [permission, showNotification],
  );
};
