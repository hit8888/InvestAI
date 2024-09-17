import { ChatConfig } from "@meaku/core/types/config";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Embed from "../components/views/Embed";
import Widget from "../components/views/Widget";
import { useChatStore } from "../stores/useChatStore";

const componentsMap: Record<ChatConfig, React.ComponentType> = {
  [ChatConfig.WIDGET]: Widget,
  [ChatConfig.EMBED]: Embed,
};

type ChatParams = {
  orgId: string;
  agentId: string;
};

const Chat = () => {
  const { orgId, agentId } = useParams<ChatParams>();
  const [searchParams] = useSearchParams();
  const setOrgId = useChatStore((state) => state.setOrgName);
  const setAgentId = useChatStore((state) => state.setAgentId);

  const config =
    (searchParams.get("config")?.toLowerCase() as ChatConfig) ||
    ChatConfig.EMBED;

  const Component = componentsMap[config];

  useEffect(() => {
    if (!orgId || !agentId) return;

    setOrgId(orgId);
    setAgentId(agentId);
  }, [orgId, agentId]);

  return <Component />;
};

export default Chat;
