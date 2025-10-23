/**
 * Loads an image and calls appropriate callback based on success/failure
 * @param imageUrl - The URL of the image to load
 * @param onSuccess - Callback function called when image loads successfully
 * @param onError - Callback function called when image fails to load
 */
export const loadImageWithCallback = (imageUrl: string, onSuccess?: () => void, onError?: () => void): void => {
  const image = new Image();

  image.onload = () => {
    onSuccess?.();
  };

  image.onerror = () => {
    onError?.();
  };

  image.src = imageUrl;
};
