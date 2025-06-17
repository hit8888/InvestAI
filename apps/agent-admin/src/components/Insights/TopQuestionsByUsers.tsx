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
      title="Most Frequently Referenced Sources"
      description={`This table displays the Sources most often retrieved by the AI agent to answer user questions. "Count"
        reflects how many times each document was retrieved within the selected date range —the higher the count, the
        more helpful the document has been in supporting user queries.`}
      rows={sources}
      columns={['Question', 'Count']}
      isLoading={isLoading}
    />
  );
};

export default TopQuestionsByUsers;
