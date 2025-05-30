import { CalendarArtifactContent, CalendarTypeEnum } from '@meaku/core/types/artifact';
import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { CalendlyCalendar } from './CalendlyCalendar';
import { CalComCalendar } from './CalComCalendar';
import { IframeCalendar } from './IframeCalendar';
import { HubSpotCalendar } from './HubSpotCalendar';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
}

export const CalendarArtifact = ({ calendarContent, handleSendUserMessage }: Props) => {
  const getCalendarContentBasedOnType = () => {
    switch (calendarContent.calendar_type) {
      case CalendarTypeEnum.CALENDLY:
        return <CalendlyCalendar calendarContent={calendarContent} handleSendUserMessage={handleSendUserMessage} />;
      case CalendarTypeEnum.CAL_COM:
        return <CalComCalendar calendarContent={calendarContent} handleSendUserMessage={handleSendUserMessage} />;
      case CalendarTypeEnum.IFRAME:
        return <IframeCalendar calendarContent={calendarContent} handleSendUserMessage={handleSendUserMessage} />;
      case CalendarTypeEnum.HUBSPOT:
        return <HubSpotCalendar calendarContent={calendarContent} handleSendUserMessage={handleSendUserMessage} />;
      default:
        return null;
    }
  };

  const isIframeCalendar = calendarContent.calendar_type === CalendarTypeEnum.IFRAME;
  const isHubSpotCalendar = calendarContent.calendar_type === CalendarTypeEnum.HUBSPOT;

  return (
    <div
      className={`h-full w-full ${isIframeCalendar || isHubSpotCalendar ? 'min-h-[400px] min-w-[600px]' : 'xl:min-h-[680px] xl:min-w-[1200px]'}`}
    >
      <AspectRatio ratio={16 / 9}>{getCalendarContentBasedOnType()}</AspectRatio>
    </div>
  );
};
