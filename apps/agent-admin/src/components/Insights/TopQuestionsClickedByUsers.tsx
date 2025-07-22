import useTopQuestionsClickedByUsers from '../../queries/query/useTopQuestionsClickedByUsers';
import CommonMinTableView from './CommonMinTableView';

interface TopQuestionsClickedByUsersProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const TopQuestionsClickedByUsers = ({ start_date, end_date, timezone }: TopQuestionsClickedByUsersProps) => {
  const { data, isLoading } = useTopQuestionsClickedByUsers({
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
      title="Top Questions Clicked by Users"
      description="The most frequent questions clicked by users, sorted by frequency. 'Count' shows how often each question was clicked within the selected date range."
      rows={sources}
      columns={['Question', 'Count']}
      isLoading={isLoading}
    />
  );
};

export default TopQuestionsClickedByUsers;
