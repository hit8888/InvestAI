import React, { type ReactNode } from 'react';
import { LucideIcon, Button, buttonVariants, Typography, cn } from '@meaku/saral';
import { Message, MessageEventType } from '../types/message';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import useFeatureConfig from '../hooks/useFeatureConfig';
import { useFeature } from '../containers/FeatureProvider';

interface FeatureHeaderProps {
  title: string;
  titleClassName?: string;
  subtitle?: string;
  welcomeMessage?: string;
  icon?: ReactNode;
  onClose?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  ctas?: { text: string; message?: string; url?: string; form_id?: string }[];
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
}

type HeaderButtonProps = {
  onClick: () => void;
  showBlurBackground?: boolean;
  icon: ReactNode;
};

const HeaderButton = ({ onClick, showBlurBackground = true, icon }: HeaderButtonProps) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={cn(
        'size-9 rounded-[108px]',
        showBlurBackground && 'bg-white/20 text-white backdrop-blur-[7.2px] hover:bg-white/25 hover:border-0',
      )}
    >
      {icon}
    </Button>
  );
};

export const FeatureHeader = ({
  title,
  titleClassName = '',
  subtitle,
  icon,
  onClose,
  onExpand,
  welcomeMessage,
  ctas,
  isExpanded,
  sendUserMessage,
}: FeatureHeaderProps) => {
  const isMobile = useIsMobile();
  const { activeFeature } = useFeature();
  const featureConfig = useFeatureConfig(activeFeature?.module_type);
  const banner = featureConfig?.banner?.public_url;
  const hasBanner = !!banner && !!welcomeMessage;

  const configTitle = featureConfig?.module_configs?.title ?? title;

  const getHeaderActions = (wrapperClasses: string) => (
    <div className={`flex items-center gap-2 absolute ${wrapperClasses}`}>
      {onExpand && !isMobile && (
        <HeaderButton
          onClick={onExpand}
          showBlurBackground={hasBanner}
          icon={
            isExpanded ? (
              <LucideIcon name="minimize-2" className="size-4" />
            ) : (
              <LucideIcon name="maximize-2" className="size-4" />
            )
          }
        />
      )}
      {onClose && (
        <HeaderButton
          onClick={onClose}
          showBlurBackground={hasBanner}
          icon={<LucideIcon name="x" className="size-4" />}
        />
      )}
    </div>
  );

  // Need to check if all buttons should be hidden based on different CTAs button
  return (
    <div className="flex flex-col p-3 gap-4">
      {hasBanner && (
        <div
          className="h-[100px] rounded-xl -mb-10 flex items-center justify-end"
          style={{
            backgroundImage: `url('${banner}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: banner ? '100px' : undefined,
          }}
        >
          {getHeaderActions('right-4 top-4')}
        </div>
      )}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between min-h-10">
          <div className="flex items-center gap-2">
            <div className={`relative ${hasBanner ? 'left-3' : 'left-0'}`}>{icon}</div>
            <div
              className={`transition-all font-medium duration-300 ease-in-out ${
                welcomeMessage
                  ? 'pointer-events-none max-h-0 scale-95 overflow-hidden hidden'
                  : 'pointer-events-auto max-h-8 scale-100 opacity-100'
              }`}
            >
              <div className="flex flex-col">
                <Typography variant="heading" fontWeight="medium" className={titleClassName}>
                  {configTitle}
                </Typography>
                {subtitle && (
                  <Typography variant="body-small" fontWeight="normal" className="text-muted-foreground">
                    {subtitle}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          {!(banner && welcomeMessage) && getHeaderActions('right-0 top-0')}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            welcomeMessage && configTitle
              ? 'max-h-32 scale-100 overflow-visible opacity-100'
              : 'pointer-events-none max-h-0 scale-95 overflow-hidden opacity-0 -my-2'
          }`}
        >
          {welcomeMessage && configTitle && (
            <div className="flex flex-col gap-1.5">
              <Typography variant="heading" fontWeight="medium">
                {configTitle}
              </Typography>
              <Typography variant="body" fontWeight="normal" className="text-muted-foreground line-clamp-3">
                {welcomeMessage}
              </Typography>
            </div>
          )}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            ctas && ctas.length > 0
              ? 'max-h-16 scale-100 overflow-visible opacity-100'
              : 'pointer-events-none max-h-0 scale-95 overflow-hidden opacity-0 -my-2'
          }`}
        >
          {ctas && ctas.length > 0 && (
            <div className="inline-flex gap-2">
              {ctas?.map((cta) =>
                cta.url ? (
                  <a
                    href={cta.url}
                    key={cta.text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ size: 'xs' })}
                  >
                    {cta.text}
                  </a>
                ) : (
                  <React.Fragment key={cta.text}>
                    {
                      <Button
                        size="xs"
                        key={cta.message ?? cta.text}
                        className="w-auto"
                        hasWipers
                        onClick={() => {
                          if (cta.message && sendUserMessage) {
                            sendUserMessage(cta.message, {
                              event_type: MessageEventType.BOOK_MEETING,
                              event_data: {
                                form_id: cta.form_id,
                              },
                            });
                          }
                        }}
                      >
                        {cta.text}
                      </Button>
                    }
                  </React.Fragment>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
