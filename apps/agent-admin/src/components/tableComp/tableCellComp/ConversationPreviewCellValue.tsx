import { CellValueProps } from '@neuraltrade/core/types/admin/admin-table';

const ConversationPreviewCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value !== '-' ? value : ''} className="line-clamp-1 w-48 2xl:w-40">
      {value}
    </span>
  );
};

export default ConversationPreviewCellValue;
