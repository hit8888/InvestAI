import { format, differenceInHours, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  DATE_FORMATS,
  HUMAN_READABLE_DATE_LABELS,
} from "@meaku/core/constants/dateFormat";

const { RECENTLY, FEW_HOURS_BACK, TODAY, YESTERDAY } =
  HUMAN_READABLE_DATE_LABELS;
const { STANDARD_DATE, ISO_DATE_TIME, STANDARD_DATE_WITH_TIME_WITHOUT_SECOND } =
  DATE_FORMATS;

class DateUtil {
  /**
   * Format the given timestamp into a readable date string
   * @param timestamp Timestamp to format
   * @returns Formatted date string in "MMM dd, yyyy" format
   */
  static formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return format(date, STANDARD_DATE);
  }

  static formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    return format(date, STANDARD_DATE_WITH_TIME_WITHOUT_SECOND);
  }

  /**
   * Check if the given timestamp is from today
   * @param timestamp Timestamp to check
   * @returns True if the date is today, false otherwise
   */
  static isToday(timestamp: string): boolean {
    const date = new Date(timestamp);
    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  /**
   * Check if the given timestamp is from yesterday
   * @param timestamp Timestamp to check
   * @returns True if the date is yesterday, false otherwise
   */
  static isYesterday(timestamp: string): boolean {
    const date = new Date(timestamp);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract one day

    return (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    );
  }

  /**
   * Get a human-readable description of the given timestamp based on certain conditions
   * @param timestamp Timestamp to convert
   * @returns Description such as "Today", "Yesterday", or a formatted date
   */
  static getDateInHumanReadableFormat(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    const hoursDiff = differenceInHours(now, date);
    const isTodayCheck = DateUtil.isToday(timestamp);
    const isYesterdayCheck = DateUtil.isYesterday(timestamp);

    if (hoursDiff < 2) {
      return RECENTLY;
    } else if (hoursDiff >= 2 && hoursDiff <= 12) {
      return FEW_HOURS_BACK;
    } else if (isTodayCheck) {
      return TODAY;
    } else if (isYesterdayCheck) {
      return YESTERDAY;
    } else {
      return DateUtil.formatDate(timestamp);
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
static getDateValueInISOString(timestamp: string): string {
    const date = new Date(timestamp); // Parse the timestamp as a Date object
    return format(toZonedTime(date, 'UTC'), ISO_DATE_TIME); // Format in UTC without timezone shift
  }
}

export default DateUtil;
