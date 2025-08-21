import { AdditionalCalendarArtifactContent } from '../../../utils/artifact';
import { SendUserMessageParams } from '../../../types/message';
import { useCommonCalendarArtifact, CalendarBookingSuccessfull } from '../../../components/calendar';

interface Props {
  calendarContent: AdditionalCalendarArtifactContent;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  artifactResponseId?: string;
}

export const BookMeetingCalendarArtifact = ({ calendarContent, handleSendUserMessage, artifactResponseId }: Props) => {
  const { getCalendarContentBasedOnType, getCalendarLoadingIndicator, isIframeOrHubSpotCalendar } =
    useCommonCalendarArtifact({
      content: calendarContent,
      handleSendUserMessage,
      artifactResponseId,
    });

  const isCalendarBookingSuccessfull =
    !isIframeOrHubSpotCalendar &&
    calendarContent?.metadata?.calendarContent?.form_data?.event?.uri &&
    calendarContent?.metadata?.calendarContent?.form_data?.invitee?.uri;

  if (isCalendarBookingSuccessfull) {
    return (
      <div className="p-8">
        <CalendarBookingSuccessfull />
      </div>
    );
  }

  return (
    <div className="relative h-[500px] w-full rounded-2xl bg-card p-2">
      {getCalendarLoadingIndicator()}
      {getCalendarContentBasedOnType()}
    </div>
  );
};
