import { XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/cn";
import ChatIcon from "../icons/chat";

type Props = {
  // isChatOpen: boolean;
};

const TriggerButton = (props: Props) => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="ui-flex ui-items-center ui-justify-end ui-overflow-hidden ui-p-4">
      <button
        onClick={() => setToggle(!toggle)}
        className={cn(
          "ui-flex ui-items-center ui-gap-2 ui-rounded-full ui-bg-gradient-to-br ui-from-primary/70 ui-to-primary ui-p-2 ui-opacity-100 ui-transition-all ui-duration-300 hover:ui-opacity-80",
          {
            "ui-w-14": !toggle,
            "ui-w-44": toggle,
          },
        )}
      >
        {toggle ? (
          <>
            <div className="ui-rounded-full ui-bg-primary-foreground">
              <div className="ui-rounded-full ui-bg-primary/50 ui-p-2">
                <ChatIcon className="ui-h-4 ui-w-4 ui-text-primary-foreground" />
              </div>
            </div>
            <div className="ui-flex ui-items-center ui-gap-2 ui-text-[15px] ui-font-medium ui-text-primary-foreground">
              <h3 className="ui-text-nowrap">Let&apos;s Chat!</h3>
              <span className="ui-animate-wave">👋</span>
            </div>
          </>
        ) : (
          <div className="ui-rounded-full ui-p-1">
            <XIcon
              strokeWidth={2}
              className="ui-h-8 ui-w-8 ui-text-primary-foreground"
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default TriggerButton;
