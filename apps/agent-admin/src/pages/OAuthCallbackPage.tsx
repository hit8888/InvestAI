import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import Typography from '@breakout/design-system/components/Typography/index';

const OAuthCallbackPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <SpinLoader />
      <Typography className="mt-4" variant="body-16" textColor="textSecondary">
        Redirecting, please wait...
      </Typography>
    </div>
  );
};

export default OAuthCallbackPage;
