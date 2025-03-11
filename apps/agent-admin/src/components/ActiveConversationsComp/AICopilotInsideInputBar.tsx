import ActiveConvJoinAICopilotIcon from '@breakout/design-system/components/icons/join-conv-aicopilot-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { useState } from 'react';
import gradientAICopilot from '../../assets/gradient-airesponse-generator.svg';
import AIGeneratorResponseContainer from './AIGeneratorResponseContainer';

const MOCK_AI_RESPONSE_MESSAGES = [
  'Yes, absolutely! You can add your own custom questions by going to the test builder. In the “Custom Questions” section, you’ll find options for multiple-choice, coding challenges, and open-ended responses. Just select the question type, input your content, and save. Let me know if you need help with a specific format!',
  'Yes! Just navigate to the test builder and use the “Custom Questions” section to add your own. You can customize question types, difficulty levels, and even scoring rules.',
  'Yes, you can add custom questions in the test builder! Are you looking to create multiple-choice, coding, or open-ended questions? I can guide you through the setup if needed.',
];

type AICopilotInsideInputBarProps = {
  handleClickOnAIResponseMessage: (value: string) => void;
};

const AICopilotInsideInputBar = ({ handleClickOnAIResponseMessage }: AICopilotInsideInputBarProps) => {
  const [isCopilotIconClicked, setIsCopilotIconClicked] = useState(false);
  // const [allAIResponseMessages, setAllAIResponseMessages] = useState<string[]>([]);
  const [allAIResponseMessages] = useState<string[]>(MOCK_AI_RESPONSE_MESSAGES);

  const handleClosePopover = () => {
    setIsCopilotIconClicked(false);
  };

  return (
    <Popover open={isCopilotIconClicked} onOpenChange={setIsCopilotIconClicked}>
      <PopoverTrigger
        asChild
        className="flex h-6 w-6 cursor-pointer items-center justify-center bg-transparent p-[0.5px]"
      >
        <ActiveConvJoinAICopilotIcon className="h-6 w-5" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={30}
        alignOffset={-20}
        className="ai-response-generator-popover-boxshadow z-[1000] flex w-[628px] flex-col items-start rounded-lg bg-white p-0"
      >
        <img src={gradientAICopilot} alt="gradient-airesponse-generator" />
        <AIGeneratorResponseContainer
          handleClosePopover={handleClosePopover}
          allAIResponseMessages={allAIResponseMessages}
          handleClickOnAIResponseMessage={handleClickOnAIResponseMessage}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AICopilotInsideInputBar;
