import Typography from '@breakout/design-system/components/Typography/index';

type NudgeMessageProps = {
  itemsSelected: number;
  pageType: string;
};

const NudgeMessage = ({ itemsSelected, pageType }: NudgeMessageProps) => {
  return (
    <div className="mb-1 flex w-full flex-col items-center self-stretch rounded-lg bg-gray-100 p-2">
      <Typography variant="body-16" textColor="gray500" align="center">
        All{' '}
        <span className="font-semibold text-system">
          {itemsSelected} {pageType}
        </span>{' '}
        on this page are selected.
      </Typography>
    </div>
  );
};

export default NudgeMessage;
