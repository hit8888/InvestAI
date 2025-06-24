import { useCallback, useEffect, useRef } from 'react';

interface OAuthResponse {
  [key: string]: string;
}

interface OAuthPopupConfig {
  title?: string;
  width?: number;
  height?: number;
  callbackPath?: string;
  onSuccess?: (data: OAuthResponse) => void;
  onError?: (error: Error) => void;
}

export const useOAuthPopup = ({
  title = 'OAuth',
  width = 500,
  height = 600,
  callbackPath = '/tenant/integration/oauth2/callback',
  onSuccess,
  onError,
}: OAuthPopupConfig) => {
  const intervalIdRef = useRef<number | null>(null);
  const popupRef = useRef<Window | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.close();
      popupRef.current = null;
    }
  }, []);

  const cleanUp = useCallback(() => {
    closePopup();
    clearTimer();
  }, [closePopup, clearTimer]);

  const openPopup = useCallback(
    (url: string) => {
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      popupRef.current = window.open(
        url,
        title,
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1`,
      );

      if (!popupRef.current) {
        onError?.(new Error('Failed to open popup window. Please check if popups are blocked.'));
        return;
      }

      intervalIdRef.current = window.setInterval(() => {
        if (!popupRef.current) {
          cleanUp();
          return;
        }

        try {
          const currentUrl = new URL(popupRef.current.location.href);
          if (currentUrl.href.includes(callbackPath)) {
            const data: OAuthResponse = {};

            currentUrl.searchParams.forEach((value, key) => {
              data[key] = value;
            });

            if (data.error) {
              onError?.(new Error(data.error_description || data.error));
            } else if (data.code || data.access_token) {
              onSuccess?.(data);
            } else {
              onError?.(new Error('No authorization code or access token found in the response'));
            }

            cleanUp();
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (!popupRef.current || popupRef.current.closed) {
            cleanUp();
          }
        }
      }, 700);
    },
    [callbackPath, cleanUp, height, onError, onSuccess, title, width],
  );

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, [cleanUp]);

  return {
    openPopup,
    cleanUp,
  };
};

export default useOAuthPopup;
