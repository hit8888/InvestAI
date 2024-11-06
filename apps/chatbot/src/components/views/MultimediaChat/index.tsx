import { cn } from "@breakout/design-system/lib/cn";
import { memo, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useConfigData from "../../../hooks/query/useConfigData";
import useInitializeSessionData from "../../../hooks/query/useInitializeSessionData";
import useLocalStorageSession from "../../../hooks/useLocalStorageSession";
import useWebSocketChat from "../../../hooks/useWebSocketChat";
import UnifiedResponseManager from "../../../managers/UnifiedResponseManager";
import { useArtifactStore } from "../../../stores/useArtifactStore";
import { useChatStore } from "../../../stores/useChatStore";
import { useMessageStore } from "../../../stores/useMessageStore";
import Artifact from "./Artifact";
import BottomBar from "./BottomBar";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

type QueryParams = {
  showGlass?: boolean;
  showDemo?: boolean;
};

const Multimedia = () => {
  const [searchParams] = useSearchParams();
  const { showGlass }: QueryParams = {
    showGlass: searchParams.get("showGlass") === "true",
  };//Remove after UI is finalized

  const [isWidthMaximized, setIsWidthMaximized] = useState(false);

  const { data: config } = useConfigData();
  const { session, refetch: fetchSessionData } = useInitializeSessionData();

  const activeArtifactId = useArtifactStore((state) => state.activeArtifactId);

  const isChatOpen = useChatStore((state) => state.isChatOpen);
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
    if (!session && !config) return; //Create a provider which renders the children only if session or config is present

    return new UnifiedResponseManager(session ?? config);
  }, [config, session]);


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


  const sessionId = manager?.getSessionId();

  const handleChatInputOnChangeCallback = () => {
    if (sessionId) return;

    fetchSessionData();
  };

  const handleExpandWidth = () => {
    setIsWidthMaximized(true);
  };

  useEffect(() => {
    const payload = {
      chatOpen: isChatOpen,
      tooltipOpen: showTooltip,
    };

    window.parent.postMessage(payload, "*");
  }, [showTooltip, isChatOpen]);

  useEffect(() => {
    if (isWidthMaximized) return;

    if (activeArtifactId) {
      handleExpandWidth();
    }
  }, [activeArtifactId, isWidthMaximized]);

  return (
    <div
      className={cn("flex h-screen flex-col backdrop-blur-md", {
        "bg-primary": showGlass,
        // "grid grid-cols-3": showDemo,
      })}
    >
      <div
        className={cn(
          "mx-auto flex flex-1 flex-col overflow-hidden rounded-2xl bg-opacity-80 backdrop-blur-lg transition-all duration-300 ease-in-out",
          {
            "border border-gray-300 bg-white bg-opacity-60 p-2": isChatOpen,
            // TODO: Enable this when we remove the toggle width switch
            // "mx-auto max-w-full lg:max-w-[80%]": false,
            // "col-span-2 w-full": showDemo,
            // "grid w-full grid-cols-3": showDemo,
            "w-10/12": !isWidthMaximized,
            "w-full": isWidthMaximized,
          },
        )}
      >
        {isChatOpen && (
          <div
            className={cn(
              "flex flex-1 flex-col overflow-hidden rounded-lg bg-white bg-opacity-20 backdrop-blur-lg",
            )}
          >
            <ChatHeader
              handlePrimaryCta={handlePrimaryCta}
              handleCloseChat={handleCloseChat}
            />
            <div
              className={cn("flex-1 overflow-y-auto bg-white bg-opacity-60", {
                "grid grid-cols-3 gap-8": !!activeArtifactId,
              })}
            >
              <div
                className={cn({
                  "col-span-2 pl-2": !!activeArtifactId,
                  hidden: !activeArtifactId,
                })}
              >
                <Artifact />
              </div>

              <div
                className={cn("flex-1 overflow-y-auto", {
                  "col-span-3": !activeArtifactId,
                  "col-span-1": !!activeArtifactId,
                })}
              >
                <ChatMessage
                  messages={messages}
                  isInSplitScreenView={!!activeArtifactId}
                />
              </div>
            </div>
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
