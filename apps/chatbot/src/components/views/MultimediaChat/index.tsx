import { cn } from "@meaku/ui/lib/cn";
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
  const { showGlass, showDemo }: QueryParams = {
    showGlass: searchParams.get("showGlass") === "true",
    showDemo: searchParams.get("showDemo") === "true",
  };

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
      className={cn("ui-flex ui-h-screen ui-flex-col ui-backdrop-blur-md", {
        "ui-bg-primary": showGlass,
        // "ui-grid ui-grid-cols-3": showDemo,
      })}
    >
      <div
        className={cn(
          "ui-mx-auto ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden ui-rounded-2xl ui-bg-opacity-80 ui-backdrop-blur-lg ui-transition-all ui-duration-300 ui-ease-in-out",
          {
            "ui-border ui-border-gray-300 ui-bg-white ui-bg-opacity-60 ui-p-2":
              isChatOpen,
            // TODO: Enable this when we remove the toggle width switch
            // "ui-mx-auto ui-max-w-full lg:ui-max-w-[80%]": false,
            // "ui-col-span-2 ui-w-full": showDemo,
            // "ui-grid ui-w-full ui-grid-cols-3": showDemo,
            "ui-w-10/12": !isWidthMaximized,
            "ui-w-full": isWidthMaximized,
          },
        )}
      >
        {isChatOpen && (
          <div
            className={cn(
              "ui-flex ui-flex-1 ui-flex-col ui-overflow-hidden ui-rounded-lg ui-bg-white ui-bg-opacity-20 ui-backdrop-blur-lg",
            )}
          >
            <ChatHeader
              handlePrimaryCta={handlePrimaryCta}
              handleCloseChat={handleCloseChat}
            />
            <div
              className={cn(
                "ui-flex-1 ui-overflow-y-auto ui-bg-white ui-bg-opacity-60",
                {
                  "ui-grid ui-grid-cols-3 ui-gap-8": !!activeArtifactId,
                },
              )}
            >
              <div
                className={cn({
                  "ui-col-span-2 ui-pl-2": !!activeArtifactId,
                  "ui-hidden": !activeArtifactId,
                })}
              >
                <Artifact />
              </div>

              <div
                className={cn("ui-overflow-y-auto", {
                  "ui-col-span-3": !activeArtifactId,
                  "ui-col-span-1": !!activeArtifactId,
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
