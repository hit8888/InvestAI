import NextArrowBig from '@breakout/design-system/components/icons/next-arrow-big';
import PreviousArrowBig from '@breakout/design-system/components/icons/previous-arrow-big';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { useTableStore } from '../../stores/useTableStore';
import { ConversationsTableViewContent } from '@meaku/core/types/admin/admin';
import { useNavigate, useParams } from 'react-router-dom';

type IProps = {
  sessionID: string;
  isDirectAccess: boolean;
};

const ConversationDetailsNavigationButtons = ({ sessionID, isDirectAccess }: IProps) => {
  const navigate = useNavigate();
  const { tenantName } = useParams<{ tenantName?: string }>();
  const { data: tableData } = useTableStore();

  const tableDataResults = tableData?.results as ConversationsTableViewContent[];

  const currentIndex = tableDataResults?.findIndex((result) => result?.session_id === sessionID) ?? -1;

  const isPreviousDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex === -1 || currentIndex >= (tableDataResults?.length ?? 1) - 1;

  const previousSessionID = isPreviousDisabled ? undefined : tableDataResults?.[currentIndex - 1]?.session_id;
  const nextSessionID = isNextDisabled ? undefined : tableDataResults?.[currentIndex + 1]?.session_id;

  const getConversationPath = (sessionId: string) =>
    tenantName ? `/${tenantName}/conversations/${sessionId}` : `/conversations/${sessionId}`;

  const handlePrevious = () => {
    if (previousSessionID) {
      navigate(getConversationPath(previousSessionID));
    }
  };

  const handleNext = () => {
    if (nextSessionID) {
      navigate(getConversationPath(nextSessionID));
    }
  };

  // This is to avoid showing the navigation buttons when user lands on details page directly via URL
  // Because in that case, we don't have the table data in the store
  if (isDirectAccess) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {currentIndex > -1 && (
        <Typography variant="label-14-medium" textColor="textSecondary">
          {currentIndex + 1} of {tableDataResults?.length}
        </Typography>
      )}
      <div className="flex items-center gap-6">
        <SingleNavigationButton isPrevious isDisabled={isPreviousDisabled} handleClick={handlePrevious} />
        <SingleNavigationButton isDisabled={isNextDisabled} handleClick={handleNext} />
      </div>
    </div>
  );
};

type ISingleNavigationButtonProps = {
  isPrevious?: boolean;
  isDisabled?: boolean;
  handleClick?: () => void;
};

const SingleNavigationButton = ({
  isPrevious = false,
  isDisabled = false,
  handleClick,
}: ISingleNavigationButtonProps) => {
  return (
    <Button size="regular" variant="tertiary" buttonStyle="icon" disabled={isDisabled} onClick={handleClick}>
      {isPrevious && <PreviousArrowBig width={'24'} height={'24'} />}
      {!isPrevious && <NextArrowBig width={'24'} height={'24'} />}
    </Button>
  );
};

export default ConversationDetailsNavigationButtons;
