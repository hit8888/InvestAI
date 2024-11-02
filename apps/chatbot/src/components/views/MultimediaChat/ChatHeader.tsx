import Button from "@meaku/ui/components/layout/button";
import { EllipsisVerticalIcon, XIcon } from "lucide-react"; //TODO: Expos this for design system

interface IProps {
  handlePrimaryCta: () => void;
  handleCloseChat: () => void;
  // handleToggleWidth: () => void;
}

const ChatHeader = (props: IProps) => {
  const { handlePrimaryCta, handleCloseChat } = props;

  return (
    <div className="flex items-center justify-between bg-gray-50 bg-opacity-20 p-2 backdrop-blur-lg">
      <div>
        <div className="rounded-md bg-primary/60 p-[2px]">
          <Button size="sm" onClick={handlePrimaryCta}>
            Book a Demo!
          </Button>
        </div>
      </div>
      {/* <div className="ui-flex ui-items-center ui-gap-1">
        <label htmlFor="toggle-width">Toggle width</label>
        <Switch onCheckedChange={handleToggleWidth} id="toggle-width" />
      </div> */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="rounded-xl border-2 border-gray-300 bg-transparent p-1 transition-colors duration-300 ease-in-out hover:border-primary"
        >
          <EllipsisVerticalIcon className="text-primary" />
        </Button>
        <Button
          size="icon"
          className="bg-transparent p-0"
          onClick={handleCloseChat}
        >
          <XIcon className="text-primary" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
