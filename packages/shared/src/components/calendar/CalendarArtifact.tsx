import { CalendarArtifactContent } from '../../utils/artifact';
import { SendUserMessageParams } from '../../types/message';
import { CalendarBookingSuccessfull, useCommonCalendarArtifact } from './index';
import { cn } from '@meaku/saral';
import { useEffect } from 'react';

interface AskAiCalendarArtifactProps {
  content: CalendarArtifactContent;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  metadata?: Record<string, unknown>;
  isSubmitted?: boolean;
  artifactResponseId?: string;
  onExpand: () => void;
}

// Type guard to safely check if calendar booking was successful
const isCalendarBookingSuccessful = (metadata: Record<string, unknown> | undefined): boolean => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const eventUri = (metadata?.calendarContent as any)?.form_data?.event?.uri;
  const inviteeUri = (metadata?.calendarContent as any)?.form_data?.invitee?.uri;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return typeof eventUri === 'string' && typeof inviteeUri === 'string';
};

export const CalendarArtifact = ({
  content,
  handleSendUserMessage,
  metadata,
  isSubmitted = false,
  artifactResponseId,
  onExpand,
}: AskAiCalendarArtifactProps) => {
  const { getCalendarContentBasedOnType, getCalendarLoadingIndicator, isIframeOrHubSpotCalendar, isBreakoutCalendar } =
    useCommonCalendarArtifact({
      content,
      handleSendUserMessage,
      artifactResponseId,
    });

  useEffect(() => {
    if (isBreakoutCalendar) {
      onExpand?.();
    }
  }, []);

  useEffect(() => {
    if (isBreakoutCalendar) {
      onExpand?.();
    }
  }, [isBreakoutCalendar]);

  const isCalendarBookingSuccessfull =
    isSubmitted || (!isIframeOrHubSpotCalendar && isCalendarBookingSuccessful(metadata));

  if (isCalendarBookingSuccessfull) {
    return (
      <div className="p-8">
        <CalendarBookingSuccessfull />
      </div>
    );
  }

  return (
    <div className={cn('h-[500px] w-full rounded-md p-2 border-none bg-card', isBreakoutCalendar && 'bg-none')}>
      {getCalendarLoadingIndicator()}
      {getCalendarContentBasedOnType()}
    </div>
  );
};
