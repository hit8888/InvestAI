import useTopQuestionsByUsers from '../../queries/query/useTopQuestionsByUsers';
import CommonMinTableView from './CommonMinTableView';

interface TopQuestionsByUsersProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const TopQuestionsByUsers = ({ start_date, end_date, timezone }: TopQuestionsByUsersProps) => {
  const { data, isLoading } = useTopQuestionsByUsers({
    start_date,
    end_date,
    timezone,
  });

  const { top_user_questions = [] } = data || {};

  const sources = top_user_questions.map((topQuestion) => ({
    text: topQuestion.question,
    value: topQuestion.count,
  }));

  return (
    <CommonMinTableView
      title="Top Questions Asked by Users"
      description={`This table lists the most frequently asked questions by users during their conversations with the AI agent, sorted in descending order. “Count” indicates how many times each question was asked within the selected date range.`}
      rows={sources}
      columns={['Question', 'Count']}
      isLoading={isLoading}
    />
  );
};

export default TopQuestionsByUsers;
