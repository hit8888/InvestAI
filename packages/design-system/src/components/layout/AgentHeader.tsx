import Button from '@breakout/design-system/components/Button/index';
import { XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { ArtifactBaseType } from '@meaku/core/types/webSocketData';
import FeedbackHeader from './FeedbackHeader';
import PoweredByBreakout from './PoweredByBreakout';

interface IProps {
  handleCloseAgent?: () => void;
  isHidden?: boolean;
  isCollapsible: boolean;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  showFeedbackHeader: boolean;
}

const AgentHeader = ({ handleCloseAgent, isHidden, isCollapsible, setActiveArtifact, showFeedbackHeader }: IProps) => {
  if (isHidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-1 items-center justify-end gap-4 pr-4">
        <PoweredByBreakout />
        {!!handleCloseAgent && isCollapsible && (
          <Button
            buttonStyle="icon"
            variant="system_tertiary"
            className="bg-transparent p-0"
            onClick={() => {
              // Send message to parent to close overlay
              window.parent.postMessage({ type: 'CLOSE_OVERLAY' }, '*');
              // Also call the original close handler
              handleCloseAgent();
            }}
          >
            <XIcon className="text-gray-400" />
          </Button>
        )}
        {showFeedbackHeader ? <FeedbackHeader setActiveArtifact={setActiveArtifact} /> : null}
      </div>
    </div>
  );
};

export default AgentHeader;
