import Typography from '@breakout/design-system/components/Typography/index';

type CardTitleAndDescriptionProps = {
  title?: string;
  description?: string;
  isMandatoryField?: boolean;
};

const CardTitleAndDescription = ({
  title = '',
  description,
  isMandatoryField = true,
}: CardTitleAndDescriptionProps) => {
  return (
    <div className="flex w-full flex-1 flex-col items-start justify-center gap-1">
      {title && (
        <Typography variant={'label-16-medium'} className="w-full flex-1">
          {title}
          {isMandatoryField ? <span className="text-base font-medium text-destructive-1000">*</span> : null}
        </Typography>
      )}
      {description && (
        <Typography variant={'caption-12-normal'} className="text-gray-500">
          {description}
        </Typography>
      )}
    </div>
  );
};

export default CardTitleAndDescription;
