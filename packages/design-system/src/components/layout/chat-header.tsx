import { ChatConfig } from "@meaku/core/types/config";
import { CopyIcon, MessageCircleIcon, XIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { cn } from "../../lib/cn";
import Ripple from "../animation/ripple";
import Logo from "../icons/logo";
import RefreshChatIcon from "../icons/refresh";
import WrappedLogo from "../icons/wrapped-logo";
import Button from "./button";

type Props = {
  config: ChatConfig;
  orgName: string;
  agentName: string;
  showMinimizedHeader?: boolean;
  handleClose?: () => void;
  title?: string;
  subtitle?: string;
  logoURL?: string;
  showRestartButton?: boolean;
  handleRestart?: () => void;
  handleCopySession?: () => void;
  handlePrimaryCta?: () => void;
};

const ChatHeader = ({
  config,
  agentName,
  orgName,
  showMinimizedHeader = false,
  handleClose,
  title,
  subtitle,
  logoURL,
  showRestartButton = false,
  handleRestart,
  handleCopySession,
  handlePrimaryCta,
}: Props) => {


  const isConfigWidget = config === ChatConfig.WIDGET;
  const showHeaderText = !isConfigWidget || !showMinimizedHeader;
  const showOrgLogoInHeader =
    !isConfigWidget && !!logoURL && !showMinimizedHeader;
  const showCtaInWidgetMode =
    isConfigWidget &&
    showMinimizedHeader &&
    typeof handlePrimaryCta === "function";
  const showCtaInEmbedMode =
    !isConfigWidget && typeof handlePrimaryCta === "function";

  const headerText = useMemo(() => {
    if (subtitle) return subtitle;

    if (isConfigWidget)
      return `Need help navigating ${orgName}? Our AI assistant is here to answer your questions.`;
    return `You’re now talking to ${agentName}, our Smart Agent at ${orgName}.`;
  }, [orgName, subtitle, isConfigWidget]);

  return (
    <div className="bg-primary p-4 text-primary-foreground">
      {isConfigWidget && (
        <div>
          <div
            className={cn("flex items-center", {
              "justify-between": showMinimizedHeader,
              "justify-end": !showMinimizedHeader,
            })}
          >
            {showMinimizedHeader && (
              <WrappedLogo inverted showRippleAnimation />
            )}

            {showOrgLogoInHeader && (
              <img src={logoURL} alt="Organization Logo" className="w-8" />
            )}

            <div className="flex items-center gap-6">
              {showCtaInWidgetMode && (
                <Button
                  onClick={handlePrimaryCta}
                  className="flex items-center gap-2 rounded-md bg-primary-foreground/70 !text-primary"
                >
                  <MessageCircleIcon className="h-5 w-5" />
                  <p className="text-sm">Book a demo</p>
                </Button>
              )}
              <button onClick={handleClose}>
                <XIcon />
              </button>
            </div>
          </div>

          {!showMinimizedHeader && (
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <div className="relative rounded-full bg-primary-foreground p-3">
                  <Logo className="h-8 w-8 text-primary" />

                  <Ripple />
                </div>
              </div>
              <h2 className="text-center text-lg font-medium">
                {title ?? "Hello!"}
              </h2>
            </div>
          )}
        </div>
      )}

      <div
        className={cn("flex items-center", {
          "justify-center": isConfigWidget,
          "justify-between": !isConfigWidget,
        })}
      >
        {showHeaderText && (
          <h2
            className={cn({
              "mt-2 text-center": isConfigWidget,
              "text-sm": !isConfigWidget,
            })}
          >
            {headerText}
          </h2>
        )}

        {showRestartButton && (
          <div className="flex items-center gap-1">
            <Button
              onClick={handleCopySession}
              size="icon"
              className="rounded-md bg-primary-foreground/70 p-2"
            >
              <CopyIcon className="h-5 w-5 text-primary " />
            </Button>
            <Button
              onClick={handleRestart}
              size="icon"
              className="rounded-md bg-primary-foreground/70 p-1"
            >
              <RefreshChatIcon className="text-primary" />
            </Button>
          </div>
        )}

        {showCtaInEmbedMode && (
          <Button
            onClick={handlePrimaryCta}
            className="flex items-center gap-2 rounded-md bg-primary-foreground/70 !text-primary"
          >
            <MessageCircleIcon className="h-5 w-5" />
            <p className="text-sm">Book a demo</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(ChatHeader);
