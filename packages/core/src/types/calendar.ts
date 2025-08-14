// Type definitions for different calendar providers

export interface CalComEventData {
  uid: string | undefined;
  title: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  eventTypeId: number | null | undefined;
  status: string | undefined;
  paymentRequired: boolean;
  isRecurring: boolean;
  allBookings?: {
    startTime: string;
    endTime: string;
  }[];
}

// Union type for all possible calendar event data
export type CalendarEventData =
  | Record<string, unknown> // generic form data
  | CalComEventData; // CalCom specific data

// Type for the handleSendUserMessage function used by calendar components
export type CalendarMessageHandler = (data: CalendarEventData) => void;
