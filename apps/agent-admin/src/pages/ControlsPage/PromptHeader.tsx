import Typography from '@breakout/design-system/components/Typography/index';

type PromptHeaderProps = {
  title: string;
  description: string;
};

const PromptHeader = ({ title, description }: PromptHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <Typography variant="title-18">{title}</Typography>
      <Typography variant="body-14" className="w-[520px]" textColor={'gray500'}>
        {description}
      </Typography>
    </div>
  );
};

export default PromptHeader;
