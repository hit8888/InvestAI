import { QualificationQuestionMetadataType, QualificationResponsesType } from '../../../../utils/artifact';
import {
  Icons,
  InlineSelectTrigger,
  InlineSelect,
  InlineSelectContent,
  InlineSelectItem,
  Typography,
  InlineSelectValue,
} from '@meaku/saral';

type IProps = {
  question: string;
  dropdownOptions: string[];
  handleSetAnswers: (answer: string | null) => void;
  isRequired: boolean;
  qualificationMetadata: QualificationQuestionMetadataType;
  hasQualificationMetadataFilledData: boolean;
  answers: Array<QualificationResponsesType>;
};

const QualificationSingleQuestion = ({
  question,
  answers,
  isRequired,
  dropdownOptions,
  handleSetAnswers,
  qualificationMetadata,
  hasQualificationMetadataFilledData,
}: IProps) => {
  const addAsterisk = isRequired ? '*' : '';
  const isQuestionAnswered = hasQualificationMetadataFilledData && qualificationMetadata.is_filled;
  const sameQuestionAnswered =
    isQuestionAnswered && qualificationMetadata.filled_data?.find((item) => item.question === question);
  const answeredValue = sameQuestionAnswered ? sameQuestionAnswered.answer : 'No Answer';

  const answer = answers.find((item) => item.question === question)?.answer;
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch p-2">
      <Typography variant="body-small" className="font-medium">
        {question}
      </Typography>
      {isQuestionAnswered ? (
        <QualificationSingleQuestionAnswered answer={answeredValue} />
      ) : (
        <InlineSelect
          value={answer || ''}
          className="w-full"
          onValueChange={handleSetAnswers}
          placeholder="Select an answer"
        >
          <InlineSelectTrigger className="w-full">
            <InlineSelectValue placeholder={`Select an answer${addAsterisk}`} />
          </InlineSelectTrigger>
          <InlineSelectContent>
            {dropdownOptions.map((option, optionIndex) => (
              <InlineSelectItem key={`${option}-${optionIndex}`} value={option ?? ''}>
                {option}
              </InlineSelectItem>
            ))}
          </InlineSelectContent>
        </InlineSelect>
      )}
    </div>
  );
};

export default QualificationSingleQuestion;

const QualificationSingleQuestionAnswered = ({ answer }: { answer: string }) => {
  return (
    <div className="inline-flex w-auto items-center gap-2 rounded-2xl bg-card p-3 px-4">
      <Icons.CheckCheck className="size-4 text-green-500" />
      <Typography variant="body-small" className="text-foreground">
        {answer}
      </Typography>
    </div>
  );
};
