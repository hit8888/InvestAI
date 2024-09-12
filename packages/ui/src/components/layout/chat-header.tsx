import { ChatConfig } from "@meaku/core/types/config";

type Props = {
  config: ChatConfig;
};

const ChatHeader = (props: Props) => {
  return (
    <div className="ui-p-4">
      <h2></h2>
    </div>
  );
};

export default ChatHeader;
