import useTopQuestionsAskedByUsers from '../../queries/query/useTopQuestionsAskedByUsers';
import CommonMinTableView from './CommonMinTableView';

interface TopQuestionsAskedByUsersProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const TopQuestionsAskedByUsers = ({ start_date, end_date, timezone }: TopQuestionsAskedByUsersProps) => {
  const { data, isLoading } = useTopQuestionsAskedByUsers({
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
      description="The most frequent questions from users, sorted by frequency. 'Count' shows how often each question was asked within the selected date range."
      rows={sources}
      columns={['Question', 'Count']}
      isLoading={isLoading}
    />
  );
};

export default TopQuestionsAskedByUsers;
