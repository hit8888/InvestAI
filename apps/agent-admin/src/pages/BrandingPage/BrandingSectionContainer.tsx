import Typography from '@breakout/design-system/components/Typography/index';

type BrandingSectionContainerProps = {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
};

const BrandingSectionContainer = ({ children, title, subTitle }: BrandingSectionContainerProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Typography variant="title-18">{title}</Typography>
      {subTitle && (
        <Typography variant="body-14" textColor="gray500">
          {subTitle}
        </Typography>
      )}
      <div className="flex w-full flex-col gap-6 rounded-2xl border border-gray-200 bg-gray-25 p-6">{children}</div>
    </div>
  );
};

export default BrandingSectionContainer;
