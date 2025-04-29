import { InlineWidget as CalendlyWidget } from 'react-calendly';
import Cal from '@calcom/embed-react';
import { CalendarArtifactContent, CalendarTypeEnum } from '@meaku/core/types/artifact';

interface Props {
  calendarContent: CalendarArtifactContent;
}

export const CalendarArtifact = ({ calendarContent }: Props) => {
  switch (calendarContent.calendar_type) {
    case CalendarTypeEnum.CALENDLY:
      return (
        <div className="h-full min-h-[600px] w-full">
          <CalendlyWidget
            url={calendarContent.calendar_url}
            prefill={calendarContent.prefill_data}
            styles={{
              height: '100%',
              width: '100%',
            }}
            utm={{
              utmSource: 'Breakout',
              utmMedium: 'chat',
              utmCampaign: 'Breakout Agent',
            }}
          />
        </div>
      );

    case CalendarTypeEnum.CAL_COM:
      return (
        <div className="h-full min-h-[600px] w-full">
          <Cal
            calLink={calendarContent.calendar_url}
            config={{ theme: 'light', ...calendarContent.prefill_data }}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '600px',
            }}
          />
        </div>
      );

    default:
      return null;
  }
};
