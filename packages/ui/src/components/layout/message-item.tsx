import { cn } from "../../lib/cn";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";

type Props = {
  message: string;
  sender: "user" | "bot";
};

const MessageItem = (props: Props) => {
  const { message, sender } = props;

  const isSenderBot = sender === "bot";

  return (
    <div
      className={cn("ui-flex ui-flex-col", {
        "ui-items-end ui-space-y-2": !isSenderBot,
        "ui-items-start": isSenderBot,
      })}
    >
      {!isSenderBot && (
        <div className="ui-flex ui-items-center ui-justify-end ui-gap-2">
          <p className="ui-text-sm ui-text-gray-500">You</p>
          <UserAvatarIcon />
        </div>
      )}

      <div
        className={cn(
          "ui-w-11/12 ui-max-w-fit ui-rounded-2xl ui-border ui-p-4 ui-text-gray-700 sm:ui-w-10/12 md:ui-w-4/6 lg:ui-w-3/6 2xl:ui-w-2/6",
          {
            "ui-flex ui-items-start ui-space-x-4 ui-rounded-tl-none ui-border-primary/25 ui-bg-primary/10":
              isSenderBot,
            "ui-rounded-br-none ui-border-gray-200": !isSenderBot,
          },
        )}
      >
        {isSenderBot && (
          <div className="ui-max-w-min">
            <WrappedLogo className="!ui-h-5 !ui-w-5" />
          </div>
        )}
        <div>
          {isSenderBot && (
            <h3 className="ui-font-medium ui-text-gray-800">Sam</h3>
          )}
          <p className="ui-text-sm md:ui-text-[15px]">{message}</p>
        </div>
      </div>

      {/* <div
        className={cn("ui-flex ui-items-center", {
          "ui-justify-end": !isSenderBot,
          "ui-justify-start": isSenderBot,
        })}
      >
        <div className="ui-flex ui-flex-col">
          <div
            className={cn("ui-flex ui-items-center ui-gap-1", {
              "ui-flex-row-reverse ui-justify-end": !isSenderBot,
              "ui-justify-start": isSenderBot,
            })}
          >
            {isSenderBot ? <WrappedLogo /> : <></>}
            <p className="ui-bg-gray-500 ui-text-xs">
              {isSenderBot ? "Sam" : "You"}
            </p>
          </div>
          <div className="ui-rounded-2xl ui-border ui-p-4"></div>
        </div>
      </div> */}
    </div>
  );
};

export default MessageItem;
