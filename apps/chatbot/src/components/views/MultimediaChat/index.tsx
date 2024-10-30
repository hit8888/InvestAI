import { cn } from "@meaku/ui/lib/cn";
import { memo, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useConfigData from "../../../hooks/query/useConfigData";
import useInitializeSessionData from "../../../hooks/query/useInitializeSessionData";
import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../../hooks/useWebSocketChat";
import UnifiedResponseManager from "../../../managers/UnifiedResponseManager";
import { useChatStore } from "../../../stores/useChatStore";
import { useMessageStore } from "../../../stores/useMessageStore";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import BottomBar from "./BottomBar";

type QueryParams = {
  showGlass?: boolean;
};

const Multimedia = () => {
  const [searchParams] = useSearchParams();
  const { showGlass }: QueryParams = {
    showGlass: searchParams.get("showGlass") === "true",
  };

  const [width, setWidth] = useState("80%");

  const { data: config } = useConfigData();
  const { session, refetch: fetchSessionData } = useInitializeSessionData();

  const isChatOpen = useChatStore((state) => state.isChatOpen);
  // const isChatOpen = true;
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const hasFirstUserMessageBeenSent = useChatStore(
    (state) => state.hasFirstUserMessageBeenSent,
  );

  const isAMessageBeingProcessed = useMessageStore(
    (state) => state.isAMessageBeingProcessed,
  );
  const messages = useMessageStore((state) => state.messages);
  const suggestedQuestions = useMessageStore(
    (state) => state.suggestedQuestions,
  );

  const manager = useMemo(() => {
    if (!session && !config) return;

    return new UnifiedResponseManager(session ?? config);
  }, [config, session]);

  const sessionId = manager?.getSessionId();

  const { handleSendUserMessage, handlePrimaryCta } = useWebSocketChat();
  const { sessionData } = useLocalStorageSession();

  const showTooltip =
    !isChatOpen && (sessionData?.showTooltip ?? true) && messages.length <= 1;

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleChatInputOnChangeCallback = () => {
    if (sessionId) return;

    fetchSessionData();
  };

  const handleToggleWidth = () => {
    setWidth((width) => (width === "80%" ? "100%" : "80%"));
  };

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };

    window.parent.postMessage(payload, "*");
  }, [showTooltip, isChatOpen]);

  return (
    <div
      className={cn("ui-flex ui-h-screen ui-flex-col ui-backdrop-blur-md", {
        "ui-bg-primary": showGlass,
      })}
    >
      <div
        className={cn(
          "ui-mx-auto ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden ui-rounded-md ui-bg-opacity-80 ui-backdrop-blur-lg ui-transition-all ui-duration-300 ui-ease-in-out",
          {
            "ui-border ui-border-gray-300 ui-bg-white ui-bg-opacity-60 ui-p-2":
              isChatOpen,
            // TODO: Enable this when we remove the toggle width switch
            "ui-mx-auto ui-max-w-full lg:ui-max-w-[80%]": false,
          },
        )}
        style={{ width }}
      >
        {isChatOpen && (
          <div className="ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden ui-rounded-md ui-bg-white ui-bg-opacity-20 ui-backdrop-blur-lg">
            <ChatHeader
              handlePrimaryCta={handlePrimaryCta}
              handleCloseChat={handleCloseChat}
              handleToggleWidth={handleToggleWidth}
            />
            <ChatMessage messages={messages} />
            <ChatInput
              handleOnChange={handleChatInputOnChangeCallback}
              handleSendMessage={handleSendUserMessage}
              isAMessageBeingProcessed={isAMessageBeingProcessed}
            />
          </div>
        )}
      </div>
      <BottomBar
        isChatOpen={isChatOpen}
        suggestedQuestions={suggestedQuestions}
        hasFirstUserMessageBeenSent={hasFirstUserMessageBeenSent}
        handleSendUserMessage={handleSendUserMessage}
        handleOpenChat={handleOpenChat}
      />
    </div>
  );
};

export default memo(Multimedia);
