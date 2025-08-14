import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const DATE_FORMATS = {
  STANDARD_DATE: 'MMM dd, yyyy', // Example: Jan 28, 2025
  STANDARD_DATE_WITH_TIME_WITHOUT_SECOND: 'MMM dd, yyyy hh:mm a', // Example: Jan 28, 2025 03:08 PM
  ISO_DATE_TIME: 'yyyy-MM-dd HH:mm:ss', // Example: 2025-01-28 15:08:52
  STANDARD_TIME: 'hh:mm a',
};

const { ISO_DATE_TIME } = DATE_FORMATS;

class DateUtil {
  /**
   * Convert a UTC timestamp to an ISO 8601 formatted string without local timezone adjustments.
   * @param timestamp Timestamp to format
   * @returns Formatted ISO string in UTC time
   */
  static getDateValueInISOString(
    timestamp: string,
    timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  ): string {
    try {
      if (!timestamp) return '';
      const date = new Date(timestamp); // Parse timestamp as Date object
      if (isNaN(date.getTime())) return ''; // Check if the date is valid
      const zonedDate = toZonedTime(date, timezone); // Convert to the given timezone
      return format(zonedDate, ISO_DATE_TIME); // Format in that timezone
    } catch (error) {
      console.warn('Invalid timestamp in getDateValueInISOString:', timestamp, error);
      return '';
    }
  }
}

export default DateUtil;
