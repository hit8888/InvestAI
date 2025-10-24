import Typography from '@breakout/design-system/components/Typography/index';

type TableHeaderProps = {
  title: string;
  description: string;
};

const TableHeader = ({ title, description }: TableHeaderProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2 self-stretch">
      <Typography variant="title-18">{title}</Typography>
      <Typography variant="body-14" className="w-full max-w-[520px]" textColor={'gray500'}>
        {description}
      </Typography>
    </div>
  );
};

export default TableHeader;
