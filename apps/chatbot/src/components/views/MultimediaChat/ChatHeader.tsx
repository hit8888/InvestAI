import Button from '@breakout/design-system/components/layout/button';
import { ArrowLeftIcon, XIcon } from 'lucide-react'; //TODO: Expos this for design system
import { useChatStore } from '../../../stores/useChatStore';

interface IProps {
  handlePrimaryCta: () => void;
  handleCloseChat: () => void;
  handleFinishDemo: () => void;
  // handleToggleWidth: () => void;
}

const ChatHeader = (props: IProps) => {
  const { handlePrimaryCta, handleFinishDemo, handleCloseChat } = props;

  const isChatMaximized = useChatStore((state) => state.isChatMaximized);

  return (
    <div className="flex items-center justify-between bg-gray-50 bg-opacity-20 p-2 backdrop-blur-lg">
      <div>
        {isChatMaximized ? (
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
              className="bg-transparent !bg-gradient-to-r !from-primary/70 !to-primary/40"
            >
              Book a Demo!
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* <Button
          size="icon"
          className="rounded-xl border-2 border-gray-300 bg-transparent p-1 transition-colors duration-300 ease-in-out hover:border-primary"
        >
          <EllipsisVerticalIcon className="text-primary" />
        </Button> */}
        <Button size="icon" className="bg-transparent p-0" onClick={handleCloseChat}>
          <XIcon className="text-primary" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
