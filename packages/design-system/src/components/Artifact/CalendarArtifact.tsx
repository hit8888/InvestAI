import { AdditionalCalendarArtifactContent, CalendarTypeEnum } from '@meaku/core/types/artifact';
import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { AgentEventType, SendUserMessageParams } from '@meaku/core/types/webSocketData';
import { CalendlyCalendar } from './CalendlyCalendar';
import { CalComCalendar } from './CalComCalendar';
import { IframeCalendar } from './IframeCalendar';
import { HubSpotCalendar } from './HubSpotCalendar';
import { cn } from '../../lib/cn';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { useState } from 'react';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import CalendarBookingSuccessfull from './CalendarBookingSuccessfull';

interface Props {
  calendarContent: AdditionalCalendarArtifactContent;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  artifactResponseId?: string;
}

export const CalendarArtifact = ({ calendarContent, handleSendUserMessage, artifactResponseId }: Props) => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendUserMessage = (data: any) => {
    handleSendUserMessage({
      message: {
        content: '',
        event_type: AgentEventType.CALENDAR_SUBMIT,
        event_data: {
          calendar_type: calendarContent.calendar_type,
          calendar_url: calendarContent.calendar_url,
          form_data: data,
          artifact_id: calendarContent.artifact_id ?? '',
        },
      },
      message_type: 'EVENT',
      response_id: artifactResponseId,
    });
  };

  const commonProps = {
    calendarContent,
    handleSendUserMessage: sendUserMessage,
    onLoad: () => setIsLoading(false),
  };

  const getCalendarContentBasedOnType = () => {
    switch (calendarContent.calendar_type) {
      case CalendarTypeEnum.CALENDLY:
        return <CalendlyCalendar {...commonProps} />;
      case CalendarTypeEnum.CAL_COM:
        return <CalComCalendar {...commonProps} />;
      case CalendarTypeEnum.IFRAME:
        return <IframeCalendar {...commonProps} />;
      case CalendarTypeEnum.HUBSPOT:
        return <HubSpotCalendar {...commonProps} />;
      default:
        return null;
    }
  };

  const isIframeCalendar = calendarContent.calendar_type === CalendarTypeEnum.IFRAME;
  const isHubSpotCalendar = calendarContent.calendar_type === CalendarTypeEnum.HUBSPOT;

  const isIframeOrHubSpotCalendar = isIframeCalendar || isHubSpotCalendar;

  const calendarContainerRef = useElementScrollIntoView<HTMLDivElement>({ shouldScroll: isMobile });

  const isCalendarBookingSuccessfull =
    !isIframeOrHubSpotCalendar &&
    calendarContent?.metadata?.calendarContent?.form_data?.event?.uri &&
    calendarContent?.metadata?.calendarContent?.form_data?.invitee?.uri;

  const getCalendarLoadingIndicator = () => {
    if (!isLoading) return null;

    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-transparent_gray_3">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
          <span className="text-sm text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  };

  if (isCalendarBookingSuccessfull) {
    return <CalendarBookingSuccessfull />;
  }

  if (isMobile) {
    return (
      <div ref={calendarContainerRef} className="relative h-[500px] w-full rounded-2xl bg-transparent_gray_3 p-2">
        {getCalendarLoadingIndicator()}
        {getCalendarContentBasedOnType()}
      </div>
    );
  }

  return (
    <div
      className={cn(
        `h-full w-full [&_[data-radix-aspect-ratio-wrapper]]:!h-full [&_[data-radix-aspect-ratio-wrapper]]:!pb-0 `,
        {
          'min-h-[300px] min-w-[600px]': isIframeOrHubSpotCalendar,
          '2xl:min-h-[380px] 2xl:min-w-[1500px]': !isIframeOrHubSpotCalendar,
        },
      )}
    >
      <AspectRatio ratio={16 / 9}>
        <div className="relative h-full w-full">
          {getCalendarLoadingIndicator()}
          {getCalendarContentBasedOnType()}
        </div>
      </AspectRatio>
    </div>
  );
};
