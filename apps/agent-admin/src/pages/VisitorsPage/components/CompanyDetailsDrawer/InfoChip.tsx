type InfoChipProps = {
  label: string;
  value: string;
  iconUrl?: string;
  isLink?: boolean;
};

const InfoChip = ({ label, value, iconUrl, isLink = false }: InfoChipProps) => {
  const chipContent = (
    <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-2.5 py-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">{label}:</span>
        <span className={`text-sm font-light ${isLink ? 'text-blue_sec-1000' : 'capitalize text-gray-900'}`}>
          {value}
        </span>
      </div>
      {iconUrl && (
        <div className="h-5.5 w-5.5 bg-white/32 flex items-center justify-center rounded-full">
          <img src={iconUrl} width={16} height={16} alt="flag-icon" className="overflow-hidden" />
        </div>
      )}
    </div>
  );

  if (!value) {
    return null;
  }

  if (isLink) {
    return (
      <a
        href={value.startsWith('http') ? value : `https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform hover:scale-105"
      >
        {chipContent}
      </a>
    );
  }

  return chipContent;
};

export default InfoChip;
