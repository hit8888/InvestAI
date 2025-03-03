import BANTAnalysisCellValue from './tableCellComp/BANTAnalysisCellValue';
import BuyerIntentCellValue from './tableCellComp/BuyerIntentCellValue';
import ConversationPreviewCellValue from './tableCellComp/ConversationPreviewCellValue';
import EmailCellValue from './tableCellComp/EmailCellValue';
import CompanyCellValue from './tableCellComp/CompanyCellValue';
import LocationCellValue from './tableCellComp/LocationCellValue';
import MeetingStatusCellValue from './tableCellComp/MeetingStatusCellValue';
import ProductOfInterestCellValue from './tableCellComp/ProductOfInterestCellValue';
import TimestampCellValue from './tableCellComp/TimestampCellValue';
import SessionIDCellValue from './tableCellComp/SessionIDCellValue';
import { LocationWithCityCountry } from '@meaku/core/types/admin/admin';

export type CellValueRendererProps = {
  id: string;
  info: string | LocationWithCityCountry;
};

const cellValueMap: { [key: string]: React.FC<{ value: string }> } = {
  email: EmailCellValue,
  role: ConversationPreviewCellValue,
  company: CompanyCellValue,
  product_of_interest: ProductOfInterestCellValue,
  timestamp: TimestampCellValue,
  // location: LocationCellValue,
  conversation_preview: ConversationPreviewCellValue,
  bant_analysis: BANTAnalysisCellValue,
  buyer_intent: BuyerIntentCellValue,
  meeting_status: MeetingStatusCellValue,
  // session_id: SessionIDCellValue,
};

const getCellValueBasedOnId = ({ id, info }: CellValueRendererProps) => {
  if (id === 'location' && typeof info !== 'string') {
    return <LocationCellValue value={info as LocationWithCityCountry} />;
  }
  if (id === 'session_id') {
    return <SessionIDCellValue value={info as string} isTooltipWithClipboard={true} />;
  }
  const Component = cellValueMap[id];
  return Component ? <Component value={info as string} /> : <span>{info as string}</span>;
};

const RenderCell = ({ id, info }: CellValueRendererProps) => {
  return getCellValueBasedOnId({ id, info });
};

export default RenderCell;
