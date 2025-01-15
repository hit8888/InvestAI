import PaginationNextArrow from '@breakout/design-system/components/icons/pagination-next-arrow';
import PaginationPreviousArrow from '@breakout/design-system/components/icons/pagination-previous-arrow';

const ConversationDetailsNavigationButtons = () => {
  return (
    <div className="flex items-center gap-4">
      <SingleNavigationButton isPrevious={true} />
      <SingleNavigationButton />
    </div>
  );
};

type IProps = {
  isPrevious?: boolean;
};

const SingleNavigationButton = ({ isPrevious = false }: IProps) => {
  return (
    <button type="button" className="flex items-center justify-center gap-2 rounded-lg p-3">
      {isPrevious && <PaginationPreviousArrow width={'16'} height={'16'} />}
      <p className="text-sm font-semibold text-primary">{isPrevious ? 'Previous' : 'Next'}</p>
      {!isPrevious && <PaginationNextArrow width={'16'} height={'16'} />}
    </button>
  );
};

export default ConversationDetailsNavigationButtons;
