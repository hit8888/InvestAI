import WrappedLogo from '@breakout/design-system/components/icons/wrapped-logo';
import Input from '@breakout/design-system/components/layout/input';
import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import useAdminUserEmail from '../../../hooks/useAdminUserEmail';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import ChatInputSendButton from '@breakout/design-system/components/layout/ChatInputSendButton';
import Typography from '@breakout/design-system/components/Typography/index';

const Welcome = () => {
  const { setUserEmail } = useAdminUserEmail();

  const [emailInputValue, setEmailInputValue] = useState<string>('');

  const manager = useConfigurationApiResponseManager();

  const agentName = manager.getAgentName();

  const handleEmailSubmission = () => {
    if (!emailInputValue) return;

    const validatedEmail = z.string().email().safeParse(emailInputValue);

    if (!validatedEmail.success) {
      return toast.error('Please enter a valid email address.');
    }

    setUserEmail(validatedEmail.data);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4 align-middle lg:p-0">
      <div className="flex flex-col items-center space-y-8">
        <div className="rounded-full shadow-2xl shadow-primary">
          <WrappedLogo size="lg" />
        </div>

        <div className="space-y-2 text-center">
          <div className="flex items-start justify-center gap-1">
            <Typography as="h1" variant="title-24" textColor="default">
              Hello! I'm {agentName}, your smart assistant.
            </Typography>
            <span className="animate-wave">👋</span>
          </div>
          <Typography variant="body-16" textColor="gray500">
            Let's start our conversation and see how I can assist you. Please enter your email to begin the dialogue.
          </Typography>
        </div>

        <form
          className="flex w-full items-center space-x-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleEmailSubmission();
          }}
        >
          <Input
            value={emailInputValue}
            onChange={(e) => setEmailInputValue(e.target.value)}
            placeholder="Enter your email here"
            type="email"
          />
          <ChatInputSendButton
            btnType="submit"
            showButton={true}
            disabled={!emailInputValue}
            btnClassName="h-10 w-10"
            onClick={handleEmailSubmission}
          />
        </form>
      </div>
    </div>
  );
};

export default memo(Welcome);
