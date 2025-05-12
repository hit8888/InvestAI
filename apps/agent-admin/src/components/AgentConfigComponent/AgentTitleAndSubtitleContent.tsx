import Typography from '@breakout/design-system/components/Typography/index';

type AgentTitleAndSubtitleContentProps = {
  title?: string;
  subtitle: string;
  isMandatoryField?: boolean;
};

const AgentTitleAndSubtitleContent = ({
  title = '',
  subtitle,
  isMandatoryField = true,
}: AgentTitleAndSubtitleContentProps) => {
  return (
    <div className="flex w-full flex-1 flex-col items-start justify-center gap-1">
      {!!title.length && (
        <Typography variant={'label-16-medium'} className="w-full flex-1">
          {title}
          {isMandatoryField ? <span className="text-base font-medium text-destructive-1000">*</span> : null}
        </Typography>
      )}
      <Typography variant={'caption-12-normal'} className="text-gray-500">
        {subtitle}
      </Typography>
    </div>
  );
};

export default AgentTitleAndSubtitleContent;
