/**
 * Generate a formatted date string (e.g., YYYYMMDD-HHmmss)
 * @returns Formatted timestamp string
 */
export const getCurrentTimestamp = () => {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

/**
 * Returns the file extension based on the file type.
 * @param {string} fileType - Expected file type ('csv' or 'xlsx').
 */
export const getFileExtension = (fileType: string) => {
  return fileType === 'csv' ? 'csv' : 'xlsx';
};

/**
 * Creates a filename using the page, current timestamp, and file extension.
 * @param {string} page - The current page/context.
 * @param {string} fileType - The file type.
 */
export const createFilename = (page: string, fileType: string) => {
  const fileExtension = getFileExtension(fileType);
  return `${page.toUpperCase()}-${getCurrentTimestamp()}.${fileExtension}`;
};

/**
 * Triggers a file download by creating an <a> element.
 * @param {string} url - The blob URL.
 * @param {string} filename - The filename to download as.
 */
export const triggerDownload = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
