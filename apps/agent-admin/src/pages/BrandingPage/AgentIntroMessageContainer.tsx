import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';
import BrandingSectionContainer from './BrandingSectionContainer';
import { AGENT_INTRO_MESSAGE_TITLE, AGENT_INTRO_MESSAGE_SUBTITLE } from '../../utils/constants';
import Input from '@breakout/design-system/components/layout/input';
import Button from '@breakout/design-system/components/Button/index';
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import PopoverWrapper from '@breakout/design-system/components/Popover/PopoverWrapper';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';

type AgentIntroMessageContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

// TODO: Remove once options are confirmed.
const MOCK_DEFAULT_DATA = [
  'Hey hooman 👋🏻 I’m your friendly chatbot, caffeine-free but full of energy!',
  'Pssst… I know all the secrets around here 👀 What are you looking for?',
  'Ask me anything—except how to cook perfect pasta 🍝 That’s beyond my pay grade.',
  'I’m like a genie 🧞‍♂️ but instead of three wishes, you get unlimited answers.',
  'Beep boop 🤖 I just booted up… what mischief can I help you with today?',
  'Hi there! 🌟 Your friendly neighborhood AI assistant reporting for duty!',
  'Ready to dive into some knowledge-sharing? 🏊‍♂️ Let me be your guide!',
  'Greetings! 🎩 I’ve got answers up my virtual sleeve - what can I help you discover?',
  'Hello! 🌈 Think of me as your personal knowledge navigator - where shall we explore?',
  'Hey! 🚀 Your AI co-pilot here, ready to help you reach new heights!',
  'Hi! 🎮 Consider me your friendly AI sidekick on this information quest!',
  'Greetings earthling! 🛸 Your AI companion has landed to assist you!',
  'Hello there! 🔍 I’m your AI detective, ready to solve any information mystery!',
  'Hi! 🎪 Welcome to the show - I’m your AI host and knowledge entertainer!',
  'Hey! 🎓 Your AI study buddy here, ready to tackle any topic with you!',
];

const AgentIntroMessageContainer = ({ agentId, agentConfigs, onUpdate }: AgentIntroMessageContainerProps) => {
  const [introMessage, setIntroMessage] = useState(
    agentConfigs?.configs?.['agent_personalization:style']?.intro_message ?? '',
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (introMessage === agentConfigs?.configs?.['agent_personalization:style']?.intro_message) {
      return;
    }
    handleConfigUpdate(
      agentId,
      {
        configs: {
          'agent_personalization:style': {
            ...agentConfigs?.configs?.['agent_personalization:style'],
            intro_message: introMessage,
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Intro Message',
    );
  };

  const handleIntroMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntroMessage(e.target.value);
  };

  const handleEmojiClick = (emoji: string) => {
    setIntroMessage((prev) => prev + emoji);
  };

  const handleIntroMessageSelect = (message: string) => {
    setIntroMessage(message);
    setIsOpen(false);
  };

  const handleClosePopover = () => {
    setIsOpen(false);
  };

  return (
    <BrandingSectionContainer title={AGENT_INTRO_MESSAGE_TITLE} subTitle={AGENT_INTRO_MESSAGE_SUBTITLE}>
      <div className="flex w-full flex-col items-center gap-4 self-stretch">
        <div className="relative w-full">
          <Input
            className={cn(
              'flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2 pr-12 text-left font-normal focus:border-gray-300 focus:ring-4 focus:ring-gray-200',
              introMessage.length === 0 && 'text-gray-400',
              isOpen && 'ring-4 ring-gray-200',
            )}
            placeholder="Hey hooman 👋🏻 I’m your friendly chatbot, caffeine-free but full of energy!"
            value={introMessage}
            onChange={handleIntroMessageChange}
          />
          <PopoverWrapper
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showPositionArrow
            alignOffset={-20}
            contentClassname="min-w-[28rem]"
            trigger={
              <ChevronDown
                className={cn('absolute right-6 top-4 h-4 w-4 cursor-pointer opacity-50', isOpen && 'rotate-180')}
              />
            }
          >
            <PopoverIntroMessageContent
              onClose={handleClosePopover}
              onSelect={handleIntroMessageSelect}
              introMessage={introMessage}
            />
          </PopoverWrapper>
        </div>

        <div className="flex w-full items-center justify-between">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </BrandingSectionContainer>
  );
};

type PopoverIntroMessageContentProps = {
  onClose: () => void;
  onSelect: (message: string) => void;
  introMessage: string;
};

const PopoverIntroMessageContent = ({ onClose, onSelect, introMessage }: PopoverIntroMessageContentProps) => {
  return (
    <div className="flex w-full flex-col items-center self-stretch">
      <div className="flex w-full items-center justify-between gap-2 border-b border-gray-200 p-4">
        <p className="flex-1 text-xl font-semibold text-gray-900">Quick Intros</p>
        <Button variant="system_tertiary" onClick={onClose}>
          <X size={24} />
        </Button>
      </div>
      <div className="max-h-[20rem] w-full overflow-auto">
        {MOCK_DEFAULT_DATA.map((data) => {
          const isSelected = introMessage === data;
          return (
            <div key={data} className="cursor-pointer px-4 py-3" onClick={() => onSelect(data)}>
              <Typography
                variant="body-14"
                className={cn('hover:text-gray-900', isSelected && 'text-gray-900')}
                textColor="gray500"
              >
                {data}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EMOJI_DATA = ['👋🏻', '🙌🏻', '😊', '🤗', '😁', '🤖'];

type EmojiPickerProps = {
  onEmojiClick: (emoji: string) => void;
};

const EmojiPicker = ({ onEmojiClick }: EmojiPickerProps) => {
  return (
    <div className="flex w-full gap-3">
      {EMOJI_DATA.map((emoji) => (
        <button
          key={emoji}
          className="cursor-pointer select-none text-2xl transition-transform duration-200 hover:scale-110"
          onClick={() => onEmojiClick(emoji)}
          type="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onEmojiClick(emoji);
            }
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default AgentIntroMessageContainer;
