import { AgentConfigResponse } from '@neuraltrade/core/types/admin/agent-configs';
import BrandingSectionContainer from './BrandingSectionContainer';
import { AGENT_INTRO_MESSAGE_TITLE, AGENT_INTRO_MESSAGE_SUBTITLE } from '../../utils/constants';
import Button from '@breakout/design-system/components/Button/index';
import { useState, useRef } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { handleConfigUpdate } from '../../pages/BrandingPage/utils';
import TextArea from '@breakout/design-system/components/TextArea/index';

type AgentIntroMessageContainerProps = {
  agentId: number;
  agentConfigs: AgentConfigResponse;
  onUpdate: () => void;
};

const AgentIntroMessageContainer = ({ agentId, agentConfigs, onUpdate }: AgentIntroMessageContainerProps) => {
  const [introMessage, setIntroMessage] = useState(agentConfigs?.metadata?.welcome_message?.message ?? '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (introMessage === agentConfigs?.metadata?.welcome_message?.message) {
      return;
    }
    handleConfigUpdate(
      agentId,
      {
        metadata: {
          ...agentConfigs.metadata,
          welcome_message: {
            ...agentConfigs.metadata.welcome_message,
            message: introMessage,
          },
        },
      },
      agentConfigs,
      onUpdate,
      'Intro Message',
    );
  };

  const handleIntroMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroMessage(e.target.value);
  };

  const handleEmojiClick = (emoji: string) => {
    const input = inputRef.current;
    if (!input) {
      setIntroMessage((prev) => prev + emoji);
      return;
    }

    const start = input.selectionStart ?? introMessage.length;
    const end = input.selectionEnd ?? introMessage.length;

    setIntroMessage((prev) => {
      const newMessage = prev.slice(0, start) + emoji + prev.slice(end);

      // Set cursor position after the inserted emoji
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPosition = start + emoji.length;
          inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          inputRef.current.focus();
        }
      }, 0);

      return newMessage;
    });
  };

  return (
    <BrandingSectionContainer title={AGENT_INTRO_MESSAGE_TITLE} subTitle={AGENT_INTRO_MESSAGE_SUBTITLE}>
      <div className="flex w-full flex-col items-center gap-4 self-stretch">
        <div className="relative w-full">
          <TextArea
            ref={inputRef}
            className={cn(
              'w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 text-left font-normal focus:border-gray-300 focus:ring-4 focus:ring-gray-200',
              introMessage.length === 0 && 'text-gray-400',
            )}
            placeholder="Hey hooman 👋🏻 I'm your friendly chatbot, caffeine-free but full of energy!"
            value={introMessage}
            onChange={handleIntroMessageChange}
          />
        </div>

        <div className="flex w-full items-center justify-between">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
          <Button
            disabled={introMessage === agentConfigs?.metadata?.welcome_message?.message}
            variant="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </BrandingSectionContainer>
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
