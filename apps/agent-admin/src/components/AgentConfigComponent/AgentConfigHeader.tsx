import Typography from '@breakout/design-system/components/Typography/index';

const AgentConfigHeader = ({ headerLabel }: { headerLabel: string }) => {
  return (
    <div className="flex-start flex w-full flex-col">
      <Typography variant={'title-24'}>{headerLabel}</Typography>
    </div>
  );
};

export default AgentConfigHeader;
