export const getMediaType = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return "unknown";

  if (["mp4", "webm", "ogg"].includes(extension)) {
    return "video";
  } else if (["mp3", "wav", "ogg"].includes(extension)) {
    return "audio";
  } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
    return "image";
  } else {
    return "unknown";
  }
};
