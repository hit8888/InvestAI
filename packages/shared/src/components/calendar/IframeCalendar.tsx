import { CalendarArtifactContent } from '../../utils/artifact';
import { useEffect, useRef } from 'react';

interface Props {
  calendarContent: CalendarArtifactContent;
  handleSendUserMessage?: (data: Record<string, unknown>) => void;
  onLoad?: () => void;
}

export const IframeCalendar = ({ calendarContent, handleSendUserMessage, onLoad }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!handleSendUserMessage) return;

    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === 'form_submit') {
        handleSendUserMessage(event.data.formData);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [calendarContent, handleSendUserMessage]);

  const handleIframeLoad = () => {
    onLoad?.();
  };

  return (
    <div className="h-full w-full overflow-auto sm:min-h-[300px]">
      <iframe
        ref={iframeRef}
        src={calendarContent.calendar_url}
        onLoad={handleIframeLoad}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
        }}
      />
    </div>
  );
};
