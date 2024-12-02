import Button from '@breakout/design-system/components/layout/button';
import { ArrowLeftIcon, XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { useArtifactStore } from '../../../stores/useArtifactStore.ts';

interface IProps {
  handlePrimaryCta: () => void;
  handleCloseChat?: () => void;
  handleFinishDemo: () => void;
}

const ChatHeader = (props: IProps) => {
  const { handlePrimaryCta, handleFinishDemo, handleCloseChat } = props;

  const isArtifactMaximized = useArtifactStore((state) => state.isArtifactMaximized);

  return (
    <div className="flex items-center justify-between border-b border-white/10 p-2">
      <div>
        {isArtifactMaximized ? (
          <Button
            size="sm"
            onClick={handleFinishDemo}
            className="flex items-center justify-center gap-2 border-2 border-primary/80 !bg-transparent text-primary/80 hover:!bg-primary/80 hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Finish Demo</span>
          </Button>
        ) : (
          <div className="rounded-md bg-primary/60 p-[2px]">
            <Button
              size="sm"
              onClick={handlePrimaryCta}
              className="bg-transparent !bg-gradient-to-r !from-primary/70 !to-primary/40 text-white"
            >
              Contact Sales
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!!handleCloseChat && (
          <Button size="icon" className="bg-transparent p-0" onClick={handleCloseChat}>
            <XIcon className="text-primary" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
