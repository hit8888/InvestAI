import BANTAnalysisCellValue from './tableCellComp/BANTAnalysisCellValue';
import BuyerIntentCellValue from './tableCellComp/BuyerIntentCellValue';
import ConversationPreviewCellValue from './tableCellComp/ConversationPreviewCellValue';
import EmailCellValue from './tableCellComp/EmailCellValue';
import LocationCellValue from './tableCellComp/LocationCellValue';
import MeetingStatusCellValue from './tableCellComp/MeetingStatusCellValue';
import ProductOfInterestCellValue from './tableCellComp/ProductOfInterestCellValue';
import TimestampCellValue from './tableCellComp/TimestampCellValue';

export type CellValueRendererProps = {
  id: string;
  info: string;
};

const cellValueMap: { [key: string]: React.FC<{ value: string }> } = {
  email: EmailCellValue,
  product_of_interest: ProductOfInterestCellValue,
  timestamp: TimestampCellValue,
  location: LocationCellValue,
  conversation_preview: ConversationPreviewCellValue,
  bant_analysis: BANTAnalysisCellValue,
  buyer_intent: BuyerIntentCellValue,
  meeting_status: MeetingStatusCellValue,
};

const getCellValueBasedOnId = ({ id, info }: CellValueRendererProps) => {
  const Component = cellValueMap[id];
  return Component ? <Component value={info} /> : <span>{info}</span>;
};

const RenderCell = ({ id, info }: CellValueRendererProps) => {
  return getCellValueBasedOnId({ id, info });
};

export default RenderCell;
