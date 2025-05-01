import { InlineWidget as CalendlyWidget } from 'react-calendly';
import Cal from '@calcom/embed-react';
import { CalendarArtifactContent, CalendarTypeEnum } from '@meaku/core/types/artifact';
import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';

interface Props {
  calendarContent: CalendarArtifactContent;
}

export const CalendarArtifact = ({ calendarContent }: Props) => {
  const getCalendarContentBasedOnType = () => {
    switch (calendarContent.calendar_type) {
      case CalendarTypeEnum.CALENDLY:
        return (
          <div className="h-full w-full sm:min-h-[600px]">
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
          <div className="h-full w-full sm:min-h-[600px]">
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

  return (
    <div className="h-full w-full xl:min-h-[680px] xl:min-w-[1200px]">
      <AspectRatio ratio={16 / 9}>{getCalendarContentBasedOnType()}</AspectRatio>
    </div>
  );
};
