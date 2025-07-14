import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import Button from '@breakout/design-system/components/Button/index';
import RefreshChatIcon from '@breakout/design-system/components/icons/refresh';
import CopyToClipboardButton from '@breakout/design-system/components/layout/CopyToClipboardButton';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import { ArtifactBaseType } from '@meaku/core/types/webSocketData';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { cn } from '@breakout/design-system/lib/cn';

interface FeedbackHeaderProps {
  className?: string;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
}

const FeedbackHeader = ({ className = '', setActiveArtifact }: FeedbackHeaderProps) => {
  const isMobile = useIsMobile();
  const manager = useSessionApiResponseManager();
  const { handleUpdateSessionData } = useLocalStorageSession();

  const handleRefreshChat = () => {
    handleUpdateSessionData({
      sessionId: undefined,
      prospectId: undefined,
    });
    setActiveArtifact(null);
    window.location.reload();
  };

  const sessionId = manager?.getSessionId();
  const hashedSessionData = `${sessionId}`;

  return (
    <div className={`flex justify-end gap-4 ${className}`}>
      <CopyToClipboardButton textToCopy={hashedSessionData} toastMessage="Session ID Copied." btnVariant="secondary" />
      <Button
        onClick={handleRefreshChat}
        className={cn('p-1', {
          'bg-primary-foreground/70': isMobile,
        })}
        buttonStyle="icon"
        variant="secondary"
      >
        <RefreshChatIcon className="text-primary" />
      </Button>
    </div>
  );
};

export default FeedbackHeader;
