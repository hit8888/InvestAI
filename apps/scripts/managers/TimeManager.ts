export function TimeManager() {
  const validateTimeFormat = (time: string | null): boolean => {
    if (!time) return true;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  /**
   * @function isWithinTimeRange
   * @description Checks if the current time is within a specified time range for a given timezone, considering weekdays only.
   * This function is designed to determine whether an operation (like showing a chat agent) should be active based on business hours.
   *
   * @param {string | null} startTime - The start time of the operational window in "HH:mm" (24-hour) format. If null, it defaults to "00:00".
   * @param {string | null} endTime - The end time of the operational window in "HH:mm" (24-hour) format. If null, it defaults to "24:00".
   * @param {string} [timezone="UTC"] - The IANA timezone identifier (e.g., "America/New_York"). It defaults to "UTC" if not provided or if the provided timezone is invalid.
   *
   * @returns {boolean} - Returns `true` if:
   *  - The current time is within the specified `startTime` and `endTime` on a weekday.
   *  - The current day is a Saturday or Sunday (agent is always shown on weekends).
   *  - `startTime` or `endTime` are not provided (no time restriction).
   *  - The provided time format is invalid.
   *  - An error occurs during execution.
   *  Returns `false` if the current time is outside the specified range on a weekday.
   *
   * @logic
   * 1. **Timezone Validation**: It first validates the provided `timezone`. If invalid, it logs a warning and falls back to "UTC".
   * 2. **Time Format Validation**: It validates that `startTime` and `endTime` strings are in the "HH:mm" format. If not, it logs a warning and returns `true`.
   * 3. **Date and Day Calculation**: It gets the current date, time, and day of the week based on the specified timezone.
   * 4. **Weekend Check**: It checks if the current day is Saturday or Sunday. If so, it immediately returns `true`, effectively disabling time-based restrictions on weekends.
   * 5. **Time Range Check**:
   *    - For weekdays, it proceeds to check the time.
   *    - It handles cases where `startTime` or `endTime` are null by setting default values ("00:00" and "24:00" respectively).
   *    - It converts the current time, start time, and end time to minutes since midnight for easy comparison.
   *    - It correctly handles time ranges that span across midnight (e.g., 22:00 to 06:00).
   * 6. **Error Handling**: The entire logic is wrapped in a `try...catch` block. In case of any unexpected errors, it logs the error and returns `true` as a fallback.
   */
  const isWithinTimeRange = (
    startTime: string | null,
    endTime: string | null,
    timezone: string = "UTC",
  ): boolean => {
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

      // If it's Saturday or Sunday, always show the agent
      if (currentDay === "Saturday" || currentDay === "Sunday") {
        return true;
      }

      // For weekdays, check the time range
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
    isWithinTimeRange,
  };
}
