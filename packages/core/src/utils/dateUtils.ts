import { format, differenceInHours, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  DATE_FORMAT_OPTIONS,
  DATE_FORMATS,
  HUMAN_READABLE_DATE_LABELS,
} from "@meaku/core/constants/dateFormat";

const { TODAY, YESTERDAY } = HUMAN_READABLE_DATE_LABELS;
const { STANDARD_DATE, ISO_DATE_TIME } = DATE_FORMATS;

class DateUtil {
  /**
   * Format the given timestamp into a readable date string
   * @param timestamp Timestamp to format
   * @param timezone User's timezone (optional)
   * @returns Formatted date string in "MMM dd, yyyy" format
   */
  static formatDate(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      ...DATE_FORMAT_OPTIONS.STANDARD_DATE,
      timeZone: timezone,
    }).format(date);
  }

  /**
   * Format the given timestamp into a readable time string
   * @param timestamp Timestamp to format
   * @param timezone User's timezone (optional)
   * @returns Formatted time string in "hh:mm a" format
   */
  static formatTimeWithMeridiem(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      ...DATE_FORMAT_OPTIONS.STANDARD_TIME,
      timeZone: timezone,
    }).format(date);
  }

  /**
   * Format the given timestamp into a readable date & time string
   * @param timestamp Timestamp to format
   * @param timezone User's timezone (optional)
   * @returns Formatted date & time string in "MMM dd, yyyy hh:mm a" format
   */
  static formatDateTime(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      ...DATE_FORMAT_OPTIONS.STANDARD_DATE_WITH_TIME_WITHOUT_SECOND,
      timeZone: timezone,
    }).format(date);
  }

  /**
   * Check if the given timestamp is from today
   * @param timestamp Timestamp to check
   * @param timezone User's detected timezone
   * @returns True if the date is today, false otherwise
   */
  static isToday(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): boolean {
    const date = new Date(timestamp);
    const now = new Date();

    return (
      date.toLocaleDateString('en-US', { timeZone: timezone }) ===
      now.toLocaleDateString('en-US', { timeZone: timezone })
    );
  }

  /**
   * Check if the given timestamp is from yesterday
   * @param timestamp Timestamp to check
   * @param timezone User's detected timezone
   * @returns True if the date is yesterday, false otherwise
   */
  static isYesterday(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): boolean {
    const date = new Date(timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract one day

    return (
      date.toLocaleDateString('en-US', { timeZone: timezone }) ===
      yesterday.toLocaleDateString('en-US', { timeZone: timezone })
    );
  }

  /**
   * Get a human-readable description of the given timestamp based on certain conditions
   * @param timestamp Timestamp to convert
   * @param timezone User's timezone (optional, defaults to local timezone)
   * @returns Human-readable date string
   */
  static getDateInHumanReadableFormat(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
    const date = new Date(timestamp);
    const now = new Date();

    const hoursDiff = differenceInHours(now.getTime(), date.getTime());
    const isTodayCheck = DateUtil.isToday(timestamp, timezone);
    const isYesterdayCheck = DateUtil.isYesterday(timestamp, timezone);

    if (isYesterdayCheck) {
      return YESTERDAY;
    } else if (isTodayCheck && hoursDiff >= 12) {
      return TODAY;
    } else if (hoursDiff <= 12) {
      return DateUtil.formatTimeWithMeridiem(timestamp, timezone)
    } else {
      return DateUtil.formatDate(timestamp, timezone);
    }
  }

  /**
   * (Filter Payload format)
   * Convert the start and end date to required format string
   * Handles timezone adjustments to ensure accurate date values.
   * @param startDateStr The start date to convert
   * @param endDateStr The end date to convert
   * @returns An array containing the start and end date in ISO 8601 format
   */
  static convertDateToAppliedFilterValue(startDateStr: Date, endDateStr: Date): string[] {

    // Parse the start date and add 1 day to counter timezone offset issues
    const startDate = addDays(new Date(startDateStr), 1);
    startDate.setUTCHours(0, 0, 0, 0); // Set start date to 00:00:00 UTC

    // Parse the end date; if not provided, use the start date as the end date
    const endDate = addDays(new Date(endDateStr || startDateStr), 1);
    endDate.setUTCHours(23, 59, 59, 999); // Set end date to 23:59:59 local time

    // Format both dates into ISO 8601 strings
    const formattedStartDate = startDate.toISOString(); // Example: "2025-01-16T00:00:00.000Z"
    const formattedEndDate = endDate.toISOString(); // Example: "2025-01-20T23:59:59.999Z"

    return [formattedStartDate, formattedEndDate];
  }

  /**
   * For displaying date in a user-friendly format
   * @param date The date object to format
   * @returns A formatted date string
   */
  static getDateDisplayForDateRange(date: Date | number | string): string {
    return format(date, STANDARD_DATE);
  }

  /**
   * Get a date range object with 'startDate' and 'endDate' based on the number of days offset.
   * @param daysOffset Number of days to add/subtract startDate today for the 'startDate' date.
   * @returns An object containing 'startDate' and 'endDate' dates.
   */
  static getDateRangeForPresetValue(daysOffset: number): {
    startDate: Date;
    endDate: Date;
  } {
    const startDate = addDays(new Date(), daysOffset);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(); // Current date
    endDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
  }

  /**
 * Convert a UTC timestamp to an ISO 8601 formatted string without local timezone adjustments.
 * @param timestamp Timestamp to format
 * @returns Formatted ISO string in UTC time
 */
  static getDateValueInISOString(timestamp: string, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): string {
    const date = new Date(timestamp); // Parse timestamp as Date object
    const zonedDate = toZonedTime(date, timezone); // Convert to the given timezone
    return format(zonedDate, ISO_DATE_TIME); // Format in that timezone
  }
}

export default DateUtil;
