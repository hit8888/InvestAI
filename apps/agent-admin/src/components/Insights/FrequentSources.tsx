import { FileText } from 'lucide-react';
import useFrequentSourcesQuery from '../../queries/query/useFrequentSourcesQuery';
import CommonMinTableView from './CommonMinTableView';
import { FrequentDocumentsResponse } from '@neuraltrade/core/types/admin/api';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../stores/useSessionStore';
import { buildPathWithTenantBase } from '../../utils/navigation';

const DOCUMENT_TYPE_TO_PATH_MAP = {
  WEB_PAGE: 'webpages',
  PDF: 'documents',
  CUSTOM_DOCUMENT: 'documents',
};

interface FrequentSourcesProps {
  start_date: string;
  end_date: string;
  timezone: string;
}

type Document = FrequentDocumentsResponse['most_frequently_referenced_documents'][number];

const FrequentSources = ({ start_date, end_date, timezone }: FrequentSourcesProps) => {
  const navigate = useNavigate();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']) ?? '';
  const { data, isLoading } = useFrequentSourcesQuery({
    start_date,
    end_date,
    timezone,
  });

  const { most_frequently_referenced_documents = [] } = data || {};

  const handleSourceRowClick = (rowData: unknown) => {
    const document = rowData as Document;
    const redirectPath = `agent/datasets/${DOCUMENT_TYPE_TO_PATH_MAP[document.data_source_type]}`;
    const fullBasePath = buildPathWithTenantBase(tenantName, redirectPath);

    if (document.data_source_type === 'WEB_PAGE') {
      if (document.web_page_id) {
        navigate(`${fullBasePath}/${document.web_page_id}`);
      } else return;
    } else {
      if (document.document_id) {
        navigate(`${fullBasePath}/${document.document_id}`);
      } else return;
    }
  };

  const sources = most_frequently_referenced_documents.map((doc) => ({
    rowData: doc,
    text: doc.title || doc.url || doc.data_source_type,
    value: doc.reference_count,
    icon: <FileText className="h-4 w-4 cursor-pointer text-bluegray-700" />,
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
      onRowClick={handleSourceRowClick}
    />
  );
};

export default FrequentSources;
