import { QualificationQuestionMetadataType } from '@neuraltrade/core/types/artifact';
import QualificationAnsweredTickIcon from '../../icons/qualification-answered-tick-icon';
import AgentDropdown from '../../Dropdown/AgentDropdown';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import Typography from '../../Typography';
import { cn } from '@breakout/design-system/lib/cn';

type IProps = {
  question: string;
  dropdownOptions: string[];
  handleSetAnswers: (answer: string | null) => void;
  isRequired: boolean;
  qualificationMetadata: QualificationQuestionMetadataType;
  hasQualificationMetadataFilledData: boolean;
};

const QualificationSingleQuestion = ({
  question,
  isRequired,
  dropdownOptions,
  handleSetAnswers,
  qualificationMetadata,
  hasQualificationMetadataFilledData,
}: IProps) => {
  const isMobile = useIsMobile();
  const addAsterisk = isRequired ? '*' : '';
  const isQuestionAnswered = hasQualificationMetadataFilledData && qualificationMetadata.is_filled;
  const sameQuestionAnswered =
    isQuestionAnswered && qualificationMetadata.filled_data?.find((item) => item.question === question);
  const answeredValue = sameQuestionAnswered ? sameQuestionAnswered.answer : 'No Answer';

  return (
    <div className="flex w-full flex-col items-start gap-6 self-stretch">
      {isMobile ? (
        <Typography variant="label-16-medium" textColor="textPrimary">
          {question}
        </Typography>
      ) : (
        <p className="w-[65%] text-3xl font-semibold text-customPrimaryText">{question}</p>
      )}
      {isQuestionAnswered ? (
        <QualificationSingleQuestionAnswered answer={answeredValue} />
      ) : (
        <AgentDropdown
          className={isMobile ? 'h-10 rounded-lg px-4 py-3' : ''}
          dropdownOpenClassName={isMobile ? 'ring-4 ring-gray-200' : ''}
          options={dropdownOptions}
          placeholderLabel={`Select an option${addAsterisk}`}
          onCallback={handleSetAnswers}
          fontToShown={isMobile ? 'text-sm' : 'text-3xl'}
        />
      )}
    </div>
  );
};

export default QualificationSingleQuestion;

const QualificationSingleQuestionAnswered = ({ answer }: { answer: string }) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn([
        'w-inherit flex h-16 items-center justify-center gap-4 rounded-full bg-gray-600 p-2 pr-6 ring-4 ring-gray-200',
        isMobile && 'h-10 gap-2 py-2 pr-4',
      ])}
    >
      <QualificationAnsweredTickIcon
        className="text-white"
        width={isMobile ? '24' : '48'}
        height={isMobile ? '24' : '48'}
      />
      <p className={cn(['text-2xl font-medium text-white', isMobile && 'text-sm'])}>{answer}</p>
    </div>
  );
};
