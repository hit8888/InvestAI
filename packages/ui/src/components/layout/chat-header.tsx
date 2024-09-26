import { ChatConfig } from "@meaku/core/types/config";
import { XIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { cn } from "../../lib/cn";
import Ripple from "../animation/ripple";
import Logo from "../icons/logo";
import WrappedLogo from "../icons/wrapped-logo";

type Props = {
  config: ChatConfig;
  orgName: string;
  showMinimizedHeader?: boolean;
  handleClose?: () => void;
  title?: string;
  subtitle?: string;
  logoURL?: string;
};

const ChatHeader = (props: Props) => {
  const {
    config,
    orgName,
    showMinimizedHeader = false,
    handleClose,
    title,
    subtitle,
    logoURL,
  } = props;

  const isConfigWidget = config === ChatConfig.WIDGET;
  const showHeaderText = !isConfigWidget || !showMinimizedHeader;
  const showOrgLogoInHeader =
    !isConfigWidget && !!logoURL && !showMinimizedHeader;

  const headerText = useMemo(() => {
    if (subtitle) return subtitle;

    if (isConfigWidget)
      return `Need help navigating ${orgName}? Our AI assistant is here to answer your questions.`;
    return `You’re now talking to Sam, our Smart Agent at ${orgName}.`;
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

            <button onClick={handleClose}>
              <XIcon />
            </button>
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
    </div>
  );
};

export default memo(ChatHeader);
