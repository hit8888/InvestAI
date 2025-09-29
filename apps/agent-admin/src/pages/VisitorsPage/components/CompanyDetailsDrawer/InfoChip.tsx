import { cn } from '@breakout/design-system/lib/cn';

type InfoChipProps = {
  label: string;
  value?: string;
  iconUrl?: string;
  isLink?: boolean;
  content?: React.ReactNode;
  className?: string;
};

const InfoChip = ({ label, value, iconUrl, isLink = false, content, className }: InfoChipProps) => {
  const chipContent = (
    <div className={cn('flex items-center gap-1.5 rounded-2xl bg-gray-100 px-2.5 py-1', className)}>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">{label}:</span>
        {content ? (
          content
        ) : (
          <span className={`text-xs font-light ${isLink ? 'text-blue_sec-1000' : 'capitalize text-gray-900'}`}>
            {value}
          </span>
        )}
      </div>
      {iconUrl && (
        <div className="h-5.5 w-5.5 bg-white/32 flex items-center justify-center rounded-full">
          <img src={iconUrl} width={16} height={16} alt="flag-icon" className="overflow-hidden" />
        </div>
      )}
    </div>
  );

  if (!value && !content) {
    return null;
  }

  if (isLink) {
    return (
      <a
        href={value?.startsWith('http') ? value : `https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {chipContent}
      </a>
    );
  }

  return chipContent;
};

export default InfoChip;
