import SomethingWentWrongIcon from '@breakout/design-system/components/icons/something-went-wrong-icon';
import Button from '@breakout/design-system/components/Button/index';
import RestartIcon from '@breakout/design-system/components/icons/restart-icon';
import { ArrowLeftIcon } from 'lucide-react';

type IProps = {
  refetch?: () => void;
};

const ErrorState = ({ refetch }: IProps) => {
  const handleTryAgain = () => {
    if (refetch) {
      refetch();
    } else {
      window.location.reload();
    }
  };
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 p-4">
        <SomethingWentWrongIcon className="h-14 w-14 text-primary" />
      </div>
      <div className="text-6xl font-semibold text-system">Something went wrong...</div>
      <p className="max-w-3xl text-center text-base font-medium text-gray-500">
        We couldn’t load this section right now. This might be due to a temporary issue or network error. Please try
        refreshing the page or come back later.
      </p>
      <div className="flex gap-4">
        <Button variant="primary" buttonStyle={'rightIcon'} onClick={handleTryAgain}>
          Try Again
          <RestartIcon className="h-4 w-4" />
        </Button>
        <Button variant="primary" buttonStyle={'leftIcon'} onClick={() => window.history.back()}>
          <ArrowLeftIcon className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
