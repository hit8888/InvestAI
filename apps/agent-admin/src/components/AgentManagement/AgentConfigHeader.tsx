import Typography from '@breakout/design-system/components/Typography/index';

type AgentConfigHeaderProps = {
  headerLabel: string;
  subHeading?: string;
  headerVariant?: 'title-24' | 'title-18';
  subHeadingVariant?: 'body-14' | 'body-16';
};

const AgentConfigHeader = ({
  headerLabel,
  subHeading,
  headerVariant = 'title-24',
  subHeadingVariant = 'body-14',
}: AgentConfigHeaderProps) => {
  return (
    <div className="flex-start flex w-full flex-col">
      <Typography className="font-bold" variant={headerVariant}>
        {headerLabel}
      </Typography>
      {subHeading && (
        <Typography variant={subHeadingVariant} textColor={'textSecondary'} className={'mt-2 max-w-xl'}>
          {subHeading}
        </Typography>
      )}
    </div>
  );
};

export default AgentConfigHeader;
