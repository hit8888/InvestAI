import SelectedFeaturesTickIcon from '@breakout/design-system/components/icons/selected-features-tick-icon';
import Typography from '@breakout/design-system/components/Typography/index';

type IProps = {
  featureName: string;
};

const SingleFeatureInDemoFlow = ({ featureName }: IProps) => {
  return (
    <div className="selected-feature-in-demo-flow flex h-20 items-center justify-center gap-4 rounded-3xl border-2 border-white py-4 pl-4 pr-6">
      <div className="selected-feature-icon-demo-flow flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-white/90">
        <SelectedFeaturesTickIcon className="h-6 w-6 text-primary/60" />
      </div>
      <Typography variant="title-24" textColor="textPrimary">
        {featureName}
      </Typography>
    </div>
  );
};

export default SingleFeatureInDemoFlow;
