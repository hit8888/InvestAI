import { ChatConfig } from "@meaku/core/types/config";
import { useSearchParams } from "react-router-dom";
import Embed from "../components/views/Embed";
import Widget from "../components/views/Widget";

const componentsMap: Record<ChatConfig, React.ComponentType> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
};

const Chat = () => {
  const [searchParams] = useSearchParams();
  const config =
    (searchParams.get("config")?.toLowerCase() as ChatConfig) ||
    ChatConfig.EMBED;

  const Component = componentsMap[config];

  return <Component />;
};

export default Chat;
