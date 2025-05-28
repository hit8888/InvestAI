import VideoDurationHandler from '../../common/VideoDurationHandler';

const DurationCellValue = ({ value }: { value: string }) => {
  return (
    <VideoDurationHandler
      videoUrl={value}
      className="hidden"
      typographyVariant="body-14"
      typographyClassName="w-full"
    />
  );
};

export default DurationCellValue;
