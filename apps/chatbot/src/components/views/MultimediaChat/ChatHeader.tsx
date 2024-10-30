import Button from "@meaku/ui/components/layout/button";
import { Switch } from "@meaku/ui/components/layout/switch"; // Adjust the import path as necessary
import { EllipsisVerticalIcon, XIcon } from "lucide-react";//TODO: Expos this for design system


interface IProps {
  handlePrimaryCta: () => void;
  handleCloseChat: () => void;
  handleToggleWidth: () => void;
}

const ChatHeaderNew = (props: IProps) => {
  const { handlePrimaryCta, handleCloseChat, handleToggleWidth } = props;

  return (
    <div className="ui-flex ui-items-center ui-justify-between ui-bg-gray-50 ui-bg-opacity-20 ui-p-2 ui-backdrop-blur-lg">
      <div>
        <div className="ui-rounded-md ui-bg-primary/60 ui-p-[2px]">
          <Button size="sm" onClick={handlePrimaryCta}>
            Book a Demo!
          </Button>
        </div>
      </div>
      <div className="ui-flex ui-items-center ui-gap-1">
        <label htmlFor="toggle-width">Toggle width</label>
        <Switch onCheckedChange={handleToggleWidth} id="toggle-width" />
      </div>
      <div className="ui-flex ui-items-center ui-gap-2">
        <Button
          size="icon"
          className="ui-rounded-xl ui-border-2 ui-border-gray-300 ui-bg-transparent ui-p-1 ui-transition-colors ui-duration-300 ui-ease-in-out hover:ui-border-primary"
        >
          <EllipsisVerticalIcon className="ui-text-primary" />
        </Button>
        <Button
          size="icon"
          className="ui-bg-transparent ui-p-0"
          onClick={handleCloseChat}
        >
          <XIcon className="ui-text-primary" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeaderNew;
