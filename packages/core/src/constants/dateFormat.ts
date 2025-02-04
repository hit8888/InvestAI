export const DATE_FORMATS = {
    STANDARD_DATE: "MMM dd, yyyy", // Example: Jan 28, 2025
    STANDARD_DATE_WITH_TIME_WITHOUT_SECOND: "MMM dd, yyyy hh:mm a", // Example: Jan 28, 2025 03:08 PM
    ISO_DATE_TIME: "yyyy-MM-dd HH:mm:ss", // Example: 2025-01-28 15:08:52
    STANDARD_TIME: "hh:mm a",
};

export const DATE_FORMAT_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
  STANDARD_DATE: { year: "numeric", month: "short", day: "2-digit" }, // Jan 28, 2025
  STANDARD_DATE_WITH_TIME_WITHOUT_SECOND: { 
    year: "numeric", month: "short", day: "2-digit", 
    hour: "2-digit", minute: "2-digit", hour12: true 
  }, // Jan 28, 2025 03:08 PM
  ISO_DATE_TIME: { 
    year: "numeric", month: "2-digit", day: "2-digit", 
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false 
  }, // 2025-01-28 15:08:52
  STANDARD_TIME: { hour: '2-digit', minute: '2-digit', hour12: true }, // 03:08 PM
};

export const HUMAN_READABLE_DATE_LABELS = {
  TODAY: "Today",
  YESTERDAY: "Yesterday",
};
