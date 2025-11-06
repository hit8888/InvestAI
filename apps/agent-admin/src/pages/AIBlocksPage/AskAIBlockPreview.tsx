import Input from '@breakout/design-system/components/layout/input';
import PreviewCardActionButtons from './components/PreviewCardActionButtons';
import Button from '@breakout/design-system/components/Button/index';
import { SendHorizonal, Sparkles } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import FallbackOrb from '@breakout/design-system/components/Orb/FallbackOrb';
import { CTABlockPreview } from './utils/blockHelpers';
import OnlineIndicator from './components/OnlineIndicator';

type AskAIBlockPreviewProps = {
  avatar_asset_url: string;
  banner: string;
  name: string;
  introduction: string;
  ctas: CTABlockPreview[];
  suggestedQuestions: string[];
};

/**
 * AskAIBlockPreview - Preview component for Ask AI block configuration
 *
 * Displays a preview of how the Ask AI block will appear to end users, including:
 * - Banner image and icon
 * - AI assistant name and introduction
 * - Call-to-action buttons
 * - Suggested questions
 * - Mock chat interface
 *
 * @param avatar_asset_url - URL of the AI assistant's icon/avatar
 * @param banner - URL of the banner image shown at the top
 * @param name - Name of the AI assistant
 * @param introduction - Introduction text for the AI assistant
 * @param ctas - Array of call-to-action button labels
 * @param suggestedQuestions - Array of suggested questions to display
 */
const AskAIBlockPreview = ({
  avatar_asset_url,
  banner,
  name,
  introduction,
  ctas,
  suggestedQuestions,
}: AskAIBlockPreviewProps) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <AskAIBlockPreviewHeader
        avatar_asset_url={avatar_asset_url}
        banner={banner}
        ctas={ctas}
        name={name}
        introduction={introduction}
      />
      <div className="w-full p-2 pt-0">
        <div className="flex min-h-48 flex-1 flex-col rounded-[16px] border bg-white">
          {/* Messages container that can scroll */}
          <div className="relative min-h-60 flex-1 p-3">
            <MockSuggestedQuestions suggestedQuestions={suggestedQuestions} />
          </div>

          {/* Input area with flex-shrink-0 to maintain fixed height */}
          <div className="flex-shrink-0">
            <MockAskAiInput />
          </div>
        </div>
      </div>
    </div>
  );
};

type AskAIBlockPreviewHeaderProps = {
  banner: string;
  avatar_asset_url: string;
  name: string;
  introduction: string;
  ctas: CTABlockPreview[];
};

const AskAIBlockPreviewHeader = ({
  banner,
  avatar_asset_url,
  name,
  introduction,
  ctas,
}: AskAIBlockPreviewHeaderProps) => {
  const hasBanner = banner && banner.length > 0;
  return (
    <div className="relative flex flex-col gap-4 p-3 pb-0">
      {hasBanner ? (
        <div
          className="flex h-[100px] items-center justify-end rounded-xl"
          style={{
            backgroundImage: `url('${banner}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: banner ? '100px' : undefined,
          }}
        >
          <div className="absolute right-5 top-5">
            <PreviewCardActionButtons />
          </div>
          <div className="absolute left-6 top-20 h-14 w-14 rounded-full bg-white">
            {avatar_asset_url ? (
              <img src={avatar_asset_url} alt="Ask AI" className="h-full w-full rounded-full " />
            ) : (
              <FallbackOrb size={56} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          {avatar_asset_url ? (
            <div className="relative">
              <img src={avatar_asset_url} alt="Ask AI" className="h-14 w-14 rounded-full object-contain" />
              <OnlineIndicator position="bottom-right" size={16} borderWidth={2} offset={3} />
            </div>
          ) : (
            <FallbackOrb size={56} />
          )}
          <PreviewCardActionButtons />
        </div>
      )}
      <div className={cn('flex w-full flex-col items-start gap-2 p-2', hasBanner && 'pb-0 pt-6')}>
        {name && name.length > 0 && (
          <Typography
            variant="label-16-medium"
            className="max-w-full truncate font-semibold leading-[20px] text-[#272A2E]"
          >
            {name}
          </Typography>
        )}
        {introduction && introduction.length > 0 && (
          <Typography variant="label-14-medium" className="line-clamp-4 max-w-full leading-[22px] text-[#272A2E]/70">
            {introduction}
          </Typography>
        )}
        {ctas.length > 0 ? (
          <div className="flex w-full items-center">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto">
              {ctas.map((cta) => (
                <Button
                  variant="primary"
                  buttonStyle={cta.icon ? 'leftIcon' : 'default'}
                  leftIcon={cta.icon && <img src={cta.icon} alt={cta.name} className="size-4 object-contain" />}
                  className="w-full whitespace-nowrap"
                >
                  {cta.name}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const MockAskAiInput = () => {
  return (
    <div className="relative flex items-center gap-2 p-3">
      <Input
        placeholder="Type your message..."
        name="message"
        className="text-foreground max-lg:text-base h-[56px] rounded-xl border py-2 pl-4 pr-14 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
        autoComplete="off"
        aria-autocomplete="none"
      />
      <Button variant="primary" type="button" className="absolute right-5 size-10 rounded-lg px-2">
        <SendHorizonal className="size-5" />
      </Button>
    </div>
  );
};

const MockSuggestedQuestions = ({ suggestedQuestions }: { suggestedQuestions: string[] }) => {
  return (
    <div className="flex w-full flex-col items-end gap-2 pl-8">
      <Typography variant="label-14-medium" className="flex items-center gap-2 p-2.5 pl-0 text-primary">
        <Sparkles className="size-4" />
        Try Asking
      </Typography>
      {suggestedQuestions.map((question) => (
        <div className="mb-2 flex w-full justify-end last:mb-0">
          <div className="w-fit">
            <button
              type="button"
              key={question}
              className="w-fit whitespace-normal break-words rounded-full bg-[#F6F7F8] px-4 py-2 text-end text-sm text-[#272A2E] hover:bg-[#E5E8EB]"
            >
              {question}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AskAIBlockPreview;
