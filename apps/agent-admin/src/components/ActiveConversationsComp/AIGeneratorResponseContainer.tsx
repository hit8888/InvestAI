import Separator from '@breakout/design-system/components/layout/separator';
import { PopoverClose } from '@breakout/design-system/components/Popover/index';
import CloseIcon from '@breakout/design-system/components/icons/popup-close-icon';
import Button from '@breakout/design-system/components/Button/index';
import AiResponseGenerateGradientButton from '@breakout/design-system/components/icons/ai-response-generate-gradient-button';
import ActiveConvJoinAICopilotIconSmall from '@breakout/design-system/components/icons/join-conv-aicopilot-icon-small';

type AIGeneratorResponseContainerProps = {
  allAIResponseMessages: string[];
  handleClickOnAIResponseMessage: (value: string) => void;
  handleClosePopover: () => void;
};

const AIGeneratorResponseContainer = ({
  handleClosePopover,
  allAIResponseMessages,
  handleClickOnAIResponseMessage,
}: AIGeneratorResponseContainerProps) => {
  const handleBothClickOnAIResponseMessage = (value: string) => {
    handleClickOnAIResponseMessage(value);
    handleClosePopover();
  };
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-b-lg bg-white p-2">
      <div className="flex w-full flex-col items-start gap-4 self-stretch">
        <div className="flex w-full flex-col items-start gap-1.5 px-2 pt-2">
          <div className="flex w-full items-start gap-1.5">
            <p className="w-full flex-1 text-lg font-semibold text-gray-900">AI Response Generator</p>
            <PopoverClose asChild>
              <CloseIcon className="h-6 w-6 text-primary" />
            </PopoverClose>
          </div>
          <p className="text-sm text-gray-500">Choose a generated response or edit before sending.</p>
        </div>
        <Separator className="h-0 w-full border-gray-200" />
      </div>
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col items-start gap-2 self-stretch">
          {allAIResponseMessages.map((message, index) => (
            <SingleAIResponseMessageContainer
              key={index}
              message={message}
              handleClickOnAIResponseMessage={handleBothClickOnAIResponseMessage}
            />
          ))}
        </div>
        <div className="flex w-full justify-end self-stretch">
          <Button className="rounded-lg p-0">
            <AiResponseGenerateGradientButton />
          </Button>
        </div>
      </div>
    </div>
  );
};

type SingleAIResponseMessageContainerProps = {
  message: string;
  handleClickOnAIResponseMessage: (value: string) => void;
};

const SingleAIResponseMessageContainer = ({
  message,
  handleClickOnAIResponseMessage,
}: SingleAIResponseMessageContainerProps) => {
  return (
    <>
      <div
        className="flex w-full cursor-pointer items-start gap-2 rounded-lg bg-white p-2"
        onClick={() => handleClickOnAIResponseMessage(message)}
      >
        <ActiveConvJoinAICopilotIconSmall className="h-4 w-4" />
        <p className="w-[90%] text-sm text-primary">{message}</p>
      </div>
      <div className="w-full pl-8 pr-2">
        <Separator isDashed />
      </div>
    </>
  );
};

export default AIGeneratorResponseContainer;
