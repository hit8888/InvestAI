import { useState } from 'react';
import { CalendarArtifactContent, CalendarTypeEnum } from '@meaku/core/types/artifact';
import { CalendarEventData } from '@meaku/core/types/calendar';
import { CalendlyCalendar } from './CalendlyCalendar';
import { CalComCalendar } from './CalComCalendar';
import { IframeCalendar } from './IframeCalendar';
import { HubSpotCalendar } from './HubSpotCalendar';
import { SendUserMessageParams, MessageEventType } from '../../types/message';

type CommonCalendarArtifactProps = {
  content: CalendarArtifactContent;
  handleSendUserMessage: (data: SendUserMessageParams) => void;
  artifactResponseId?: string;
};

const useCommonCalendarArtifact = ({
  content,
  handleSendUserMessage,
  artifactResponseId,
}: CommonCalendarArtifactProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const sendUserMessage = (data: CalendarEventData) => {
    handleSendUserMessage({
      message: '',
      overrides: {
        event_data: {
          calendar_type: content.calendar_type,
          calendar_url: content.calendar_url,
          form_data: data,
          artifact_id: content.artifact_id ?? '',
        },
        event_type: MessageEventType.CALENDAR_SUBMIT,
        response_id: artifactResponseId,
      },
    });
  };

  const commonProps = {
    calendarContent: content,
    handleSendUserMessage: sendUserMessage,
    onLoad: () => setIsLoading(false),
  };

  const getCalendarContentBasedOnType = () => {
    switch (content.calendar_type) {
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

  const isIframeCalendar = content.calendar_type === CalendarTypeEnum.IFRAME;
  const isHubSpotCalendar = content.calendar_type === CalendarTypeEnum.HUBSPOT;

  const isIframeOrHubSpotCalendar = isIframeCalendar || isHubSpotCalendar;

  const getCalendarLoadingIndicator = () => {
    if (!isLoading) return null;

    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-card">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary"></div>
          <span className="text-sm text-gray-600">Loading calendar...</span>
        </div>
      </div>
    );
  };

  return {
    getCalendarContentBasedOnType,
    getCalendarLoadingIndicator,
    isIframeOrHubSpotCalendar,
  };
};

export default useCommonCalendarArtifact;
