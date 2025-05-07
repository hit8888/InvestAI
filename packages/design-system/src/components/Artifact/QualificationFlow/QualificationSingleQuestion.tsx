import { QualificationQuestionMetadataType } from '@meaku/core/types/artifact';
import QualificationAnsweredTickIcon from '../../icons/qualification-answered-tick-icon';
import AgentDropdown from '../../Dropdown/AgentDropdown';

type IProps = {
  question: string;
  dropdownOptions: string[];
  handleSetAnswers: (answer: string | null) => void;
  isRequired: boolean;
  qualificationMetadata: QualificationQuestionMetadataType;
};

const QualificationSingleQuestion = ({
  question,
  isRequired,
  dropdownOptions,
  handleSetAnswers,
  qualificationMetadata,
}: IProps) => {
  const addAsterisk = isRequired ? '*' : '';
  const isQuestionAnswered = qualificationMetadata.is_filled;
  const sameQuestionAnswered =
    isQuestionAnswered && qualificationMetadata.filled_data?.find((item) => item.question === question);
  const answeredValue = sameQuestionAnswered ? sameQuestionAnswered.answer : 'No Answer';

  return (
    <div className="flex w-full flex-col items-start gap-6 self-stretch">
      <p className="w-[65%] text-3xl font-semibold text-customPrimaryText">
        {question}
        {!isRequired ? ' (Optional)' : ''}{' '}
      </p>
      {isQuestionAnswered ? (
        <QualificationSingleQuestionAnswered answer={answeredValue} />
      ) : (
        <AgentDropdown
          options={dropdownOptions}
          placeholderLabel={`Select an option${addAsterisk}`}
          onCallback={handleSetAnswers}
        />
      )}
    </div>
  );
};

export default QualificationSingleQuestion;

const QualificationSingleQuestionAnswered = ({ answer }: { answer: string }) => {
  return (
    <div className="w-inherit flex h-16 items-center justify-center gap-4 rounded-full bg-gray-600 p-2 pr-6 ring-4 ring-gray-200">
      <QualificationAnsweredTickIcon className="text-white" width="48" height="48" />
      <p className="text-2xl font-medium text-white">{answer}</p>
    </div>
  );
};
