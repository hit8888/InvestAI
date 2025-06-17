import { FileText } from 'lucide-react';
import useFrequentSourcesQuery from '../../queries/query/useFrequentSourcesQuery';
import CommonMinTableView from './CommonMinTableView';

interface FrequentSourcesProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

const FrequentSources = ({ start_date, end_date, timezone }: FrequentSourcesProps) => {
  const { data, isLoading } = useFrequentSourcesQuery({
    start_date,
    end_date,
    timezone,
  });

  const { most_frequently_referenced_documents = [] } = data || {};

  const sources = most_frequently_referenced_documents.map((doc) => ({
    text: doc.title,
    value: doc.reference_count,
    icon: <FileText className="h-4 w-4 text-bluegray-700" />,
  }));

  return (
    <CommonMinTableView
      title="Most Frequently Referenced Sources"
      description={`This table displays the Sources most often retrieved by the AI agent to answer user questions. "Count"
        reflects how many times each document was retrieved within the selected date range —the higher the count, the
        more helpful the document has been in supporting user queries.`}
      rows={sources}
      columns={['Document Title', 'Count']}
      isLoading={isLoading}
    />
  );
};

export default FrequentSources;
