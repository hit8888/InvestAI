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
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (options: NotificationOptions) => Notification | null;
  isPermissionGranted: boolean;
}

export const useNotification = (): UseNotificationReturn => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      console.error('This browser does not support notifications');
      return 'denied';
    }

    try {
      const newPermission = await Notification.requestPermission();
      setPermission(newPermission);
      return newPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, [isSupported]);

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

        // Set up event handlers
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
    [isSupported, permission],
  );

  return useMemo(
    () => ({
      permission,
      isSupported,
      requestPermission,
      showNotification,
      isPermissionGranted: permission === 'granted',
    }),
    [permission, isSupported, requestPermission, showNotification],
  );
};
