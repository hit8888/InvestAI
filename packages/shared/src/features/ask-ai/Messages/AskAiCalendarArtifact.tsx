import { CalendarArtifactContent } from '../../../utils/artifact';
import { SendUserMessageParams } from '../../../types/message';
import { CalendarBookingSuccessfull, useCommonCalendarArtifact } from '../../../components/calendar';

interface AskAiCalendarArtifactProps {
  content: CalendarArtifactContent;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  metadata?: Record<string, unknown>;
  isSubmitted?: boolean;
  artifactResponseId?: string;
}

// Type guard to safely check if calendar booking was successful
const isCalendarBookingSuccessful = (metadata: Record<string, unknown> | undefined): boolean => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const eventUri = (metadata?.calendarContent as any)?.form_data?.event?.uri;
  const inviteeUri = (metadata?.calendarContent as any)?.form_data?.invitee?.uri;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return typeof eventUri === 'string' && typeof inviteeUri === 'string';
};

export const AskAiCalendarArtifact = ({
  content,
  handleSendUserMessage,
  metadata,
  isSubmitted = false,
  artifactResponseId,
}: AskAiCalendarArtifactProps) => {
  const { getCalendarContentBasedOnType, getCalendarLoadingIndicator, isIframeOrHubSpotCalendar } =
    useCommonCalendarArtifact({
      content,
      handleSendUserMessage,
      artifactResponseId,
    });

  const isCalendarBookingSuccessfull =
    isSubmitted || (!isIframeOrHubSpotCalendar && isCalendarBookingSuccessful(metadata));

  if (isCalendarBookingSuccessfull) {
    return (
      <div className="mt-4 w-full p-2 pl-10">
        <CalendarBookingSuccessfull />
      </div>
    );
  }

  return (
    <div className="relative mt-4 h-[500px] w-full rounded-xl border border-gray-300 bg-gray-100 p-2">
      {getCalendarLoadingIndicator()}
      {getCalendarContentBasedOnType()}
    </div>
  );
};
