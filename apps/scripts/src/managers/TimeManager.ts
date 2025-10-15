export const DEFAULT_ALLOWED_DAYS = "MTWTFSS";

export function TimeManager() {
  const validateTimeFormat = (time: string | null): boolean => {
    if (!time) return true;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const parseDayString = (dayString: string): string[] => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days.filter((_, index) => dayString[index] !== "_");
  };

  const validateDayString = (dayString: string): boolean => {
    if (!dayString || typeof dayString !== "string") return false;
    return dayString.length === 7; // Must be exactly 7 characters
  };

  /**
   * @function isWithinTimeRange
   * @description Checks if the current time is within a specified time range for a given timezone and allowed days.
   * This function is designed to determine whether an operation (like showing a chat agent) should be active based on business hours and specific days.
   *
   * @param {string | null} startTime - The start time of the operational window in "HH:mm" (24-hour) format. If null, it defaults to "00:00".
   * @param {string | null} endTime - The end time of the operational window in "HH:mm" (24-hour) format. If null, it defaults to "24:00".
   * @param {string} [timezone="UTC"] - The IANA timezone identifier (e.g., "America/New_York"). It defaults to "UTC" if not provided or if the provided timezone is invalid.
   * @param {string} [allowedDays] - String representing allowed days of the week:
   *  - Must be exactly 7 characters long
   *  - Each position maps to Mon,Tue,Wed,Thu,Fri,Sat,Sun
   *  - Use any character except '_' to enable that day
   *  Examples:
   *  - "MTWTFSS" = All days (Default)
   *  - "xxxxx__" = First 5 days (Mon-Fri)
   *  - "_____xx" = Weekends only
   *  - "x_x_x__" = Mon,Wed,Fri only
   *  If not provided, defaults to all days for backward compatibility.
   *
   * @returns {boolean} - Returns `true` if:
   *  - The current day is in the `allowedDays` array AND the current time is within the specified `startTime` and `endTime`.
   *  - `startTime` or `endTime` are not provided (no time restriction) AND the current day is allowed.
   *  - The provided time format is invalid (fallback behavior).
   *  - An error occurs during execution (fallback behavior).
   *  Returns `false` if:
   *  - The current day is not in the `allowedDays` array.
   *  - The current time is outside the specified range on an allowed day.
   *
   * @logic
   * 1. **Timezone Validation**: It first validates the provided `timezone`. If invalid, it logs a warning and falls back to "UTC".
   * 2. **Time Format Validation**: It validates that `startTime` and `endTime` strings are in the "HH:mm" format. If not, it logs a warning and returns `true`.
   * 3. **Date and Day Calculation**: It gets the current date, time, and day of the week based on the specified timezone.
   * 4. **Day Check**: It checks if the current day is in the `allowedDays` array. If not, it returns `false`.
   * 5. **Time Range Check**:
   *    - For allowed days, it proceeds to check the time.
   *    - It handles cases where `startTime` or `endTime` are null by setting default values ("00:00" and "24:00" respectively).
   *    - It converts the current time, start time, and end time to minutes since midnight for easy comparison.
   *    - It correctly handles time ranges that span across midnight (e.g., 22:00 to 06:00).
   * 6. **Error Handling**: The entire logic is wrapped in a `try...catch` block. In case of any unexpected errors, it logs the error and returns `true` as a fallback.
   */
  const isWithinTimeRange = ({
    startTime,
    endTime,
    timezone = "UTC",
    allowedDays = DEFAULT_ALLOWED_DAYS,
  }: {
    startTime: string | null;
    endTime: string | null;
    timezone?: string;
    allowedDays?: string;
  }): boolean => {
    try {
      // Validate timezone
      if (!Intl.DateTimeFormat().resolvedOptions().timeZone) {
        console.warn("Invalid timezone provided, falling back to UTC");
        timezone = "UTC";
      }

      // Validate time formats
      if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
        console.warn(
          "Invalid time format provided. Expected format: HH:mm (24-hour)",
        );
        return true; // Fallback to showing the agent if time format is invalid
      }

      // Validate allowed days format if provided
      if (allowedDays && !validateDayString(allowedDays)) {
        console.warn(
          "Invalid day format provided. Must be exactly 7 characters. Use any character except '_' to enable a day. Position 1-7 maps to Mon-Sun. Example: 'xxxxx__' for weekdays. Falling back to all days.",
        );
        allowedDays = DEFAULT_ALLOWED_DAYS; // Fall back to all days (default behavior)
      }

      // Get current date in the specified timezone
      const now = new Date();

      // Validate if the date is valid
      if (isNaN(now.getTime())) {
        console.error("Invalid date object");
        return true; // Fallback to showing the agent
      }

      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      const currentTimeStr = now.toLocaleTimeString("en-US", options);
      const currentDay = now.toLocaleDateString("en-US", {
        timeZone: timezone,
        weekday: "long",
      });

      // Parse the day string to get array of allowed days
      const effectiveAllowedDays = parseDayString(allowedDays);

      // Check if current day is in the allowed days list
      if (!effectiveAllowedDays.includes(currentDay)) {
        return false; // Don't show agent on non-allowed days
      }

      // For allowed days, check the time range
      if (!startTime && !endTime) return true; // If times not set, always show

      // Use default values if only one time is specified
      const effectiveStartTime = startTime || "00:00";
      const effectiveEndTime = endTime || "24:00";

      const [currentHour, currentMinute] = currentTimeStr
        .split(":")
        .map(Number);

      // Parse start and end times
      const [startHour, startMinute] = effectiveStartTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = effectiveEndTime.split(":").map(Number);

      // Validate parsed time values with specific checks
      const timeValues = {
        current: { hour: currentHour, minute: currentMinute },
        start: { hour: startHour, minute: startMinute },
        end: { hour: endHour, minute: endMinute },
      };

      const isValidTimeValue = (hour: number, minute: number): boolean => {
        return (
          !isNaN(hour) &&
          !isNaN(minute) &&
          hour >= 0 &&
          hour <= 23 &&
          minute >= 0 &&
          minute <= 59
        );
      };

      const invalidTimes = Object.entries(timeValues)
        .filter(([_, time]) => !isValidTimeValue(time.hour, time.minute))
        .map(([key, time]) => `${key}: ${time.hour}:${time.minute}`);

      if (invalidTimes.length > 0) {
        return true; // Fallback to showing the agent
      }

      // Convert all times to minutes since midnight for easier comparison
      const currentMinutes = currentHour * 60 + currentMinute;
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      let isWithinRange;
      if (endMinutes < startMinutes) {
        // Time range spans across midnight
        isWithinRange =
          currentMinutes >= startMinutes || currentMinutes <= endMinutes;
      } else {
        // Normal time range within same day
        isWithinRange =
          currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      }

      return isWithinRange;
    } catch (error) {
      console.error("Error in TimeManager:", error);
      return true; // Fallback to showing the agent in case of any errors
    }
  };

  // Return public API
  return {
    validateTimeFormat,
    parseDayString,
    validateDayString,
    isWithinTimeRange,
  };
}
