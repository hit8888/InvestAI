import SendIcon from "@meaku/ui/components/icons/send";
import WrappedLogo from "@meaku/ui/components/icons/wrapped-logo";
import Button from "@meaku/ui/components/layout/button";
import Input from "@meaku/ui/components/layout/input";
import { memo, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import useInitializeSessionData from "../../../hooks/query/useInitializeSessionData";
import useAdminUserEmail from "../../../hooks/useAdminUserEmail";
import InitializeSessionResponseManager from "../../../managers/InitializeSessionResponseManager";

const Welcome = () => {
  const { setUserEmail } = useAdminUserEmail();

  const [emailInputValue, setEmailInputValue] = useState<string>("");

  const { session } = useInitializeSessionData({
    ignoreUpdatingLocalStorage: true,
  });

  const manager = useMemo(() => {
    if (!session) return;

    return new InitializeSessionResponseManager(session);
  }, [session]);

  const agentName = manager?.getAgentName() ?? "";

  const handleEmailSubmission = () => {
    if (!emailInputValue) return;

    const validatedEmail = z.string().email().safeParse(emailInputValue);

    if (!validatedEmail.success) {
      return toast.error("Please enter a valid email address.");
    }

    setUserEmail(validatedEmail.data);
  };

  return (
    <div className="ui-flex ui-h-full ui-w-full ui-items-center ui-justify-center">
      <div className="ui-flex ui-flex-col ui-items-center ui-space-y-8">
        <div className="ui-rounded-full ui-shadow-2xl ui-shadow-primary">
          <WrappedLogo size="lg" />
        </div>

        <div className="ui-space-y-2 ui-text-center">
          <div className="ui-flex ui-items-start ui-justify-center ui-gap-1">
            <h1 className="ui-text-2xl ui-font-medium ui-text-gray-800">
              Hello! I'm {agentName}, your smart assistant.
            </h1>
            <span className="ui-animate-wave">👋</span>
          </div>
          <p className="ui-text-gray-700">
            Let's start our conversation and see how I can assist you. Please
            enter your email to begin the dialogue.
          </p>
        </div>

        <form
          className="ui-flex ui-w-full ui-items-center ui-space-x-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailSubmission;
          }}
        >
          <Input
            value={emailInputValue}
            onChange={(e) => setEmailInputValue(e.target.value)}
            placeholder="Enter your email here"
            type="email"
          />
          <Button
            size="icon"
            disabled={!emailInputValue}
            onClick={handleEmailSubmission}
          >
            <SendIcon className="ui-text-primary-foreground" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(Welcome);
