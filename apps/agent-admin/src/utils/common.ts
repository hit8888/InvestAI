import { ENV } from '../config/env';

export const isDev = ENV.VITE_APP_ENV !== 'production' && ENV.VITE_APP_ENV !== 'staging';
export const isProduction = ENV.VITE_APP_ENV === 'production';

// Function to trigger the download
export const handleDownload = (fileType: string, linkUrl: string, downloadedFileName: string) => {
  const url = linkUrl;
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.setAttribute('download', `${downloadedFileName}.${fileType}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('Invalid file type selected');
  }
};
