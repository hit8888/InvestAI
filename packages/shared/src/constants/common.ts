import { ENV } from './env';

export const isProduction = ENV.VITE_APP_ENV === 'production';
