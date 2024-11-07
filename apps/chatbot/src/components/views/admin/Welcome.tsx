import SendIcon from "@breakout/design-system/components/icons/send";
import WrappedLogo from "@breakout/design-system/components/icons/wrapped-logo";
import Button from "@breakout/design-system/components/layout/button";
import Input from "@breakout/design-system/components/layout/input";
import { memo, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import useConfigData from "../../../hooks/query/useConfigDataQuery";
import useAdminUserEmail from "../../../hooks/useAdminUserEmail";
import UnifiedResponseManager from "../../../managers/UnifiedSessionConfigResponseManager";

const Welcome = () => {
  const { setUserEmail } = useAdminUserEmail();

  const [emailInputValue, setEmailInputValue] = useState<string>("");

  const { data: config } = useConfigData();

  const manager = useMemo(() => {
    if (!config) return;

    return new UnifiedResponseManager(config);
  }, [config]);

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
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        <div className="rounded-full shadow-2xl shadow-primary">
          <WrappedLogo size="lg" />
        </div>

        <div className="space-y-2 text-center">
          <div className="flex items-start justify-center gap-1">
            <h1 className="text-2xl font-medium text-gray-800">
              Hello! I'm {agentName}, your smart assistant.
            </h1>
            <span className="animate-wave">👋</span>
          </div>
          <p className="text-gray-700">
            Let's start our conversation and see how I can assist you. Please
            enter your email to begin the dialogue.
          </p>
        </div>

        <form
          className="flex w-full items-center space-x-3"
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
            <SendIcon className="text-primary-foreground" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(Welcome);
