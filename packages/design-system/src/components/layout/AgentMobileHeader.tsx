import Button from '@breakout/design-system/components/Button/index';
import { XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { ArtifactBaseType } from '@neuraltrade/core/types/webSocketData';
import FeedbackHeader from './FeedbackHeader';
import Typography from '../Typography';
import { useCallback } from 'react';

interface IProps {
  handleCloseAgent?: () => void;
  isHidden?: boolean;
  isCollapsible: boolean;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  showFeedbackHeader: boolean;
  renderOrb: () => React.ReactNode;
  agentName: string;
}

const AgentMobileHeader = ({
  handleCloseAgent,
  isHidden,
  isCollapsible,
  setActiveArtifact,
  showFeedbackHeader,
  renderOrb,
  agentName,
}: IProps) => {
  const handleClose = useCallback(() => {
    // Send message to parent to close overlay
    window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
    // Also call the original close handler
    handleCloseAgent?.();
  }, [handleCloseAgent]);

  if (isHidden) {
    return null;
  }

  return (
    <div className="flex w-full items-center gap-6 self-stretch rounded-t-none bg-primary p-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full bg-white p-0.5">{renderOrb()}</div>
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-positive-1000" />
            <Typography variant="label-14-medium" align={'center'} className="text-white">
              {agentName}
            </Typography>
          </div>
          <Typography variant="caption-12-normal" align={'center'} className="text-gray-200">
            AI Assistant
          </Typography>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4 pr-2">
        {!!handleCloseAgent && isCollapsible && (
          <Button buttonStyle="icon" variant="system_tertiary" className="bg-transparent p-0" onClick={handleClose}>
            <XIcon className="text-white" />
          </Button>
        )}
        {showFeedbackHeader ? <FeedbackHeader setActiveArtifact={setActiveArtifact} /> : null}
      </div>
    </div>
  );
};

export default AgentMobileHeader;
