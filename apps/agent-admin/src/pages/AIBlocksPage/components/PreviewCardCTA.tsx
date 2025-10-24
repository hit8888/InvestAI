import Button from '@breakout/design-system/components/Button/index';

const PreviewCardCTA = ({ btnLabel }: { btnLabel: string }) => {
  return (
    <div className="p-4">
      <Button type="button" className="w-full" variant="primary">
        {btnLabel}
      </Button>
    </div>
  );
};

export default PreviewCardCTA;
