import React, { type ReactNode } from 'react';
import { Icons, Button, buttonVariants, Typography } from '@meaku/saral';
import { Message, MessageEventType } from '../types/message';

interface FeatureHeaderProps {
  title: string;
  subtitle?: string;
  welcomeMessage?: string;
  icon?: ReactNode;
  onClose?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  ctas?: { text: string; message?: string; url?: string }[];
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
  coverImage?: string;
}

export const FeatureHeader = ({
  title,
  subtitle,
  icon,
  onClose,
  onExpand,
  welcomeMessage,
  ctas,
  isExpanded,
  sendUserMessage,
  coverImage,
}: FeatureHeaderProps) => {
  const getHeaderActions = () => (
    <div className="flex items-center gap-2">
      {onExpand && (
        <Button size="icon" variant="ghost" onClick={onExpand} className="size-[30px] rounded-[108px]">
          {isExpanded ? <Icons.Minimize2 className="size-3" /> : <Icons.Maximize2 className="size-3" />}
        </Button>
      )}
      {onClose && (
        <Button size="icon" variant="ghost" onClick={onClose} className="size-[30px] rounded-[108px]">
          <Icons.X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  // Need to check if all buttons should be hidden based on different CTAs button
  return (
    <div className="flex flex-col p-3 gap-4 border-b border-gray-100">
      {coverImage && welcomeMessage && (
        <div
          className="inset-3 h-[100px] -mb-10 rounded-lg flex items-start justify-end"
          style={{
            backgroundImage: `url('${coverImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: coverImage ? '100px' : undefined,
          }}
        >
          {getHeaderActions()}
        </div>
      )}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 -ml-1">
            {icon}
            <div
              className={`transition-all duration-300 ease-in-out ${
                welcomeMessage
                  ? 'pointer-events-none max-h-0 scale-95 overflow-hidden opacity-0'
                  : 'pointer-events-auto max-h-8 scale-100 opacity-100'
              }`}
            >
              <div className="flex flex-col">
                <Typography variant="heading" fontWeight="semibold">
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="body-small" fontWeight="normal" className="text-muted-foreground">
                    {subtitle}
                  </Typography>
                )}
              </div>
            </div>
          </div>
          {!welcomeMessage && getHeaderActions()}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            welcomeMessage && title
              ? 'max-h-32 scale-100 overflow-visible opacity-100'
              : 'pointer-events-none max-h-0 scale-95 overflow-hidden opacity-0 -my-2'
          }`}
        >
          {welcomeMessage && title && (
            <div className="flex flex-col gap-1.5">
              <Typography variant="heading" fontWeight="semibold">
                {title}
              </Typography>
              <Typography variant="body" fontWeight="normal" className="text-muted-foreground">
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
                        onClick={() => {
                          if (cta.message && sendUserMessage) {
                            sendUserMessage(cta.message, {
                              event_type: MessageEventType.BOOK_MEETING,
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
