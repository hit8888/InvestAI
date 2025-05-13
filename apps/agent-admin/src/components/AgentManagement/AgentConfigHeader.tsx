import Typography from '@breakout/design-system/components/Typography/index';

const AgentConfigHeader = ({ headerLabel, subHeading }: { headerLabel: string; subHeading?: string }) => {
  return (
    <div className="flex-start flex w-full flex-col">
      <Typography variant={'title-24'}>{headerLabel}</Typography>
      {subHeading && (
        <Typography variant={'body-14'} textColor={'textSecondary'} className={'mt-2 max-w-xl'}>
          {subHeading}
        </Typography>
      )}
    </div>
  );
};

export default AgentConfigHeader;
