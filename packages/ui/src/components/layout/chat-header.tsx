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
  handlePrimaryCta?: () => void;
  handleCopyMessagesJSON?: () => void;
};

const ChatHeader = (props: Props) => {
  const {
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
    handlePrimaryCta,
    handleCopyMessagesJSON,
  } = props;

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
    <div className="ui-bg-primary ui-p-4 ui-text-primary-foreground">
      {isConfigWidget && (
        <div>
          <div
            className={cn("ui-flex ui-items-center", {
              "ui-justify-between": showMinimizedHeader,
              "ui-justify-end": !showMinimizedHeader,
            })}
          >
            {showMinimizedHeader && (
              <WrappedLogo inverted showRippleAnimation />
            )}

            {showOrgLogoInHeader && (
              <img src={logoURL} alt="Organization Logo" className="ui-w-8" />
            )}

            <div className="ui-flex ui-items-center ui-gap-6">
              {showCtaInWidgetMode && (
                <Button
                  onClick={handlePrimaryCta}
                  className="ui-flex ui-items-center ui-gap-2 ui-rounded-md ui-bg-primary-foreground/70 !ui-text-primary"
                >
                  <MessageCircleIcon className="ui-h-5 ui-w-5" />
                  <p className="ui-text-sm">Book a demo</p>
                </Button>
              )}
              <button onClick={handleClose}>
                <XIcon />
              </button>
            </div>
          </div>

          {!showMinimizedHeader && (
            <div className="ui-space-y-1">
              <div className="ui-flex ui-items-center ui-justify-center">
                <div className="ui-relative ui-rounded-full ui-bg-primary-foreground ui-p-3">
                  <Logo className="ui-h-8 ui-w-8 ui-text-primary" />

                  <Ripple />
                </div>
              </div>
              <h2 className="ui-text-center ui-text-lg ui-font-medium">
                {title ?? "Hello!"}
              </h2>
            </div>
          )}
        </div>
      )}

      <div
        className={cn("ui-flex ui-items-center", {
          "ui-justify-center": isConfigWidget,
          "ui-justify-between": !isConfigWidget,
        })}
      >
        {showHeaderText && (
          <h2
            className={cn({
              "ui-mt-2 ui-text-center": isConfigWidget,
              "ui-text-sm": !isConfigWidget,
            })}
          >
            {headerText}
          </h2>
        )}

        {showRestartButton && (
          <div className="ui-flex ui-items-center ui-gap-1">
            <Button
              onClick={handleCopyMessagesJSON}
              size="icon"
              className="ui-rounded-md ui-bg-primary-foreground/70 ui-p-2"
            >
              <CopyIcon className="ui-h-5 ui-w-5 ui-text-primary " />
            </Button>
            <Button
              onClick={handleRestart}
              size="icon"
              className="ui-rounded-md ui-bg-primary-foreground/70 ui-p-1"
            >
              <RefreshChatIcon className="ui-text-primary" />
            </Button>
          </div>
        )}

        {showCtaInEmbedMode && (
          <Button
            onClick={handlePrimaryCta}
            className="ui-flex ui-items-center ui-gap-2 ui-rounded-md ui-bg-primary-foreground/70 !ui-text-primary"
          >
            <MessageCircleIcon className="ui-h-5 ui-w-5" />
            <p className="ui-text-sm">Book a demo</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(ChatHeader);
