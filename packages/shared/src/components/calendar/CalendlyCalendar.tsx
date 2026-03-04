import { EventScheduledEvent, InlineWidget as CalendlyWidget, useCalendlyEventListener } from 'react-calendly';
import { CalendarArtifactContent } from '../../utils/artifact';
import useDelayedCallback from '@neuraltrade/core/hooks/useDelayedCallback';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: (data: Record<string, unknown>) => void;
  onLoad?: () => void;
}

export const CalendlyCalendar = ({ calendarContent, handleSendUserMessage, onLoad }: Props) => {
  useCalendlyEventListener({
    onEventScheduled: (e: EventScheduledEvent) => {
      if (handleSendUserMessage) {
        handleSendUserMessage(e.data.payload);
      }
    },
  });

  useDelayedCallback(onLoad);

  return (
    <div className="h-full w-full overflow-auto">
      <CalendlyWidget
        url={calendarContent.calendar_url}
        prefill={calendarContent.prefill_data}
        styles={{
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
};
